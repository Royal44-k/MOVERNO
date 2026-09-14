import React from 'react';
import {Video} from '@remotion/media';
import {AbsoluteFill,Interactive,staticFile} from 'remotion';
import {Film} from '../films';
export const ModelTryOn:React.FC<{film:Film;close?:boolean}>=({film,close=false})=><AbsoluteFill name={close?'On-foot detail reprise':'Natural model movement'} style={{backgroundColor:'#101110',overflow:'hidden'}}>
 <Video src={staticFile(`assets/${film.id}-model-motion.mp4`)} muted objectFit="cover" style={{width:'100%',height:'100%',objectPosition:'center bottom',scale:close?1.18:1,transformOrigin:'50% 90%'}} />
 <Interactive.Div name="Small campaign index" style={{position:'absolute',left:68,top:88,color:'#ece6d9',fontFamily:'Arial',fontSize:23,letterSpacing:5,textShadow:'0px 2px 10px #101110'}}>{film.id} / MOVERNO</Interactive.Div>
</AbsoluteFill>;
