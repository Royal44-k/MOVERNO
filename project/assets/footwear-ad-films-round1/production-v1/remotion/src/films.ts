export type Film = {
  id:string; title:string; english:string; slogan:string;
  detail:string; second:string; focus:[number,number]; focusB:[number,number];
};
export const films:Record<string,Film>={
 A01:{id:'A01',title:'错位街角',english:'SHIFTED PERSPECTIVE',slogan:'路径，由我编排。',detail:'链纹不止于表面',second:'把名字，写进步伐',focus:[.27,.47],focusB:[.28,.69]},
 A02:{id:'A02',title:'一道开场',english:'CUT THROUGH',slogan:'由这一道，切入。',detail:'斜线，划开日常',second:'银色拉链 × 黑金链纹',focus:[.22,.47],focusB:[.27,.58]},
 A03:{id:'A03',title:'重力留白',english:'A SENSE OF SCALE',slogan:'步伐，自成尺度。',detail:'放大比例，收起喧哗',second:'立体徽记，呼应浅压纹',focus:[.28,.78],focusB:[.33,.28]}
};
