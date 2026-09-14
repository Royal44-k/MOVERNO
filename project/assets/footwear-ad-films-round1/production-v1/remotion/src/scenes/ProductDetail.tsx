import React from 'react';
import {AbsoluteFill,CanvasImage,Interactive,interpolate,staticFile,useCurrentFrame} from 'remotion';
import {Film} from '../films';
export const ProductDetail:React.FC<{film:Film;second?:boolean}>=({film,second=false})=>{
 const frame=useCurrentFrame();
 const focus=second?film.focusB:film.focus;
 return <AbsoluteFill name="Product macro" style={{backgroundColor:'#101110',overflow:'hidden'}}>
  <Interactive.Div name="Macro photographic framing" style={{position:'absolute',inset:0,scale:interpolate(frame,[0,165],[1.08,1],{extrapolateRight:'clamp',output:'perceptual-scale'})}}>
   <CanvasImage src={staticFile(`assets/${film.id}-product.png`)} style={{position:'absolute',width:4200,height:2800,left:540-focus[0]*4200,top:800-focus[1]*2800}} />
  </Interactive.Div>
  <Interactive.Div name="Dark editorial caption panel" style={{position:'absolute',bottom:0,left:0,right:0,padding:'76px 80px 130px',backgroundColor:'#101110',color:'#ece6d9'}}>
   <Interactive.Div name="Detail index" style={{fontFamily:'Arial',fontSize:23,letterSpacing:6,color:'#c1b9ad',marginBottom:28,opacity:interpolate(frame,[4,20],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'})}}>{film.id} / {second?'SIGNATURE':'CLOSE STUDY'}</Interactive.Div>
   <Interactive.Div name="Visible design point" style={{fontFamily:'Microsoft YaHei',fontSize:58,lineHeight:1.35,translate:interpolate(frame,[6,26],['0px 16px','0px 0px'],{extrapolateLeft:'clamp',extrapolateRight:'clamp'}),opacity:interpolate(frame,[6,26],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'})}}>{second?film.second:film.detail}</Interactive.Div>
  </Interactive.Div>
 </AbsoluteFill>;
};
