import React from 'react';
import {AbsoluteFill,staticFile} from 'remotion';
import {Audio} from '@remotion/media';
import {TransitionSeries,linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {films} from './films';
import {ProductDetail} from './scenes/ProductDetail';
import {ProductHero} from './scenes/ProductHero';
import {ModelTryOn} from './scenes/ModelTryOn';
import {BrandClose} from './scenes/BrandClose';
export const ShoeFilm:React.FC<{shoeId:string}>=({shoeId})=>{
 const film=films[shoeId];
 if(!film) throw new Error('Unknown shoe ID');
 return <AbsoluteFill style={{backgroundColor:'#101110'}}>
  <TransitionSeries>
   <TransitionSeries.Sequence durationInFrames={138} name="Tactile opening"><ProductDetail film={film}/></TransitionSeries.Sequence>
   <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames:9})}/>
   <TransitionSeries.Sequence durationInFrames={107} name="Natural model movement"><ModelTryOn film={film}/></TransitionSeries.Sequence>
   <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames:9})}/>
   <TransitionSeries.Sequence durationInFrames={154} name="Brand detail"><ProductDetail film={film} second/></TransitionSeries.Sequence>
   <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames:9})}/>
   <TransitionSeries.Sequence durationInFrames={162} name="Whole product"><ProductHero film={film}/></TransitionSeries.Sequence>
   <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames:9})}/>
   <TransitionSeries.Sequence durationInFrames={107} name="On-foot closer view"><ModelTryOn film={film} close/></TransitionSeries.Sequence>
   <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames:9})}/>
   <TransitionSeries.Sequence durationInFrames={166} name="Campaign line"><ProductHero film={film} closing/></TransitionSeries.Sequence>
   <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames:9})}/>
   <TransitionSeries.Sequence durationInFrames={120} name="HyperFrames signature"><BrandClose/></TransitionSeries.Sequence>
  </TransitionSeries>
  <Audio src={staticFile(`assets/${film.id}-score.wav`)}/>
 </AbsoluteFill>;
};
