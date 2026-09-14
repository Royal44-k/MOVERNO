"""Download and restore the complete MOVERNO asset archive with SHA-256 checks.

Python 3.10+ standard library only. Existing unequal files are never overwritten.
"""
import argparse
import hashlib
import json
from pathlib import Path
import shutil
import urllib.request
import zipfile

ROOT=Path(__file__).resolve().parents[1]

def sha(path):
    h=hashlib.sha256()
    with path.open('rb') as f:
        for block in iter(lambda:f.read(1024*1024),b''):h.update(block)
    return h.hexdigest()

def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--download',action='store_true')
    parser.add_argument('--group',help='Restore only one group from the release manifest')
    parser.add_argument('--cache',type=Path,default=ROOT/'.download-cache')
    parser.add_argument('--output',type=Path,default=ROOT/'restored-assets')
    parser.add_argument('--verify-only',action='store_true')
    args=parser.parse_args()
    bundles=json.loads((ROOT/'archive/release-manifest.json').read_text(encoding='utf-8'))
    files=json.loads((ROOT/'archive/asset-manifest.json').read_text(encoding='utf-8'))
    if args.group:
        bundles=[b for b in bundles if b['group']==args.group]
        if not bundles:raise SystemExit('Unknown group: '+args.group)
    names={b['name'] for b in bundles}
    expected={f['path']:f for f in files if f['release_asset'] in names}
    output=args.output.resolve()
    if not args.verify_only:
        args.cache.mkdir(parents=True,exist_ok=True)
        output.mkdir(parents=True,exist_ok=True)
        for i,b in enumerate(bundles,1):
            package=args.cache/b['name']
            if not package.exists():
                if not args.download:raise SystemExit('Missing ZIP. Add --download or place ZIPs in '+str(args.cache))
                partial=package.with_suffix('.zip.partial')
                print(f"Downloading {i}/{len(bundles)}: {b['name']}",flush=True)
                req=urllib.request.Request(b['url'],headers={'User-Agent':'MOVERNO-Archive-Restore'})
                with urllib.request.urlopen(req,timeout=120) as response,partial.open('wb') as target:
                    shutil.copyfileobj(response,target,1024*1024)
                if partial.stat().st_size!=b['bytes'] or sha(partial)!=b['sha256']:
                    raise SystemExit('Download hash mismatch; partial retained: '+b['name'])
                partial.rename(package)
            if package.stat().st_size!=b['bytes'] or sha(package)!=b['sha256']:
                raise SystemExit('ZIP hash mismatch: '+b['name'])
            with zipfile.ZipFile(package) as z:
                for info in z.infolist():
                    if info.is_dir():continue
                    if info.filename not in expected:raise SystemExit('Unexpected archive member: '+info.filename)
                    target=(output/info.filename).resolve()
                    if not target.is_relative_to(output):raise SystemExit('Unsafe archive member')
                    item=expected[info.filename]
                    if target.exists():
                        if sha(target)!=item['sha256']:raise SystemExit('Refusing to overwrite changed file: '+str(target))
                        continue
                    target.parent.mkdir(parents=True,exist_ok=True)
                    with z.open(info) as src,target.open('xb') as dst:shutil.copyfileobj(src,dst,1024*1024)
    failures=[]
    for rel,f in expected.items():
        p=output/rel
        if not p.is_file() or p.stat().st_size!=f['bytes'] or sha(p)!=f['sha256']:failures.append(rel)
    if failures:
        print(json.dumps({'result':'FAIL','files':failures},ensure_ascii=False,indent=2));raise SystemExit(1)
    print(json.dumps({'result':'PASS','verified_files':len(expected),'output':str(output)},ensure_ascii=False))

if __name__=='__main__':main()
