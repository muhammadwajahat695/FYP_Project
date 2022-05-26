import React from 'react';

import Spinner from 'react-spinkit';

export default ({error})=>{
    return error 
    ? <div>An error has occured loading the image</div>
    : <Spinner name="ball-scale-ripple-multiple"/>
} 