import React from 'react';
import {Video} from '@remotion/media';
import {AbsoluteFill,staticFile} from 'remotion';
export const BrandClose:React.FC=()=> <AbsoluteFill name="HyperFrames brand signature" style={{backgroundColor:'#101110'}}><Video name="HyperFrames rendered sting" src={staticFile('assets/brand-signature.mp4')} muted style={{width:'100%',height:'100%'}} /></AbsoluteFill>;
