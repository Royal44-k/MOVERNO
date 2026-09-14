import React from 'react';
import {AbsoluteFill,CanvasImage,Interactive,interpolate,staticFile,useCurrentFrame} from 'remotion';
import {Film} from '../films';
export const ProductHero:React.FC<{film:Film;closing?:boolean}>=({film,closing=false})=>{
 const frame=useCurrentFrame();
 return <AbsoluteFill name="Cinematic product portrait" style={{backgroundColor:'#101110',overflow:'hidden'}}>
  <CanvasImage src={staticFile(`assets/${film.id}-hero.png`)} style={{width:'100%',height:'100%',objectFit:'cover',scale:interpolate(frame,[0,166],[1.055,1],{extrapolateRight:'clamp',output:'perceptual-scale'})}} />
  <Interactive.Div name="Title grouping" style={{position:'absolute',top:170,left:80,right:80,color:'#ece6d9'}}>
   <Interactive.Div name="Film index" style={{fontFamily:'Arial',fontSize:24,letterSpacing:5,marginBottom:24,opacity:interpolate(frame,[6,24],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'})}}>{film.english}</Interactive.Div>
   <Interactive.Div name="Film title or exclusive line" style={{fontFamily:'Microsoft YaHei',fontWeight:400,fontSize:closing?66:92,lineHeight:1.35,opacity:interpolate(frame,[10,32],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'}),translate:interpolate(frame,[10,32],['0px 20px','0px 0px'],{extrapolateLeft:'clamp',extrapolateRight:'clamp'})}}>{closing?film.slogan:film.title}</Interactive.Div>
  </Interactive.Div>
 </AbsoluteFill>;
};
