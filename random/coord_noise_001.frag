#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

float box(vec2 _st, vec2 _size){
    _size = vec2(0.5)-_size*0.5;
    vec2 uv = smoothstep(_size,_size+vec2(1e-4),_st);
    uv *= smoothstep(_size,_size+vec2(1e-4),vec2(1.0)-_st);
    return uv.x*uv.y;
}

float circle(vec2 _st, float _radius){
    return length(_st - 0.5) * _radius;
}

vec2  rotate(vec2 _pos, float angle){
    _pos -= 0.5; 
    _pos =  mat2(cos(angle), -sin(angle), sin(angle), cos(angle)) * _pos;
    _pos += 0.5;
    return _pos;
}


vec3 patten(vec2 _pos, float _zoom){
    


    _pos *= _zoom  ;
    //_pos = rotate(_pos, 0.);
    //_pos += vec2(0.1,1.2);

    

    float index = 0.;
    index += step(1. , mod(_pos.x,2.) );
    index += step(1., mod(_pos.y,2.) ) * 2.;

    _pos = fract(_pos);

    if(index == 1.){
        _pos += vec2(0.0, 0.0) ;
        _pos = rotate(_pos, 2.3 * u_time);
        

    }

    if(index == 3.){
        _pos += vec2(0.0, 0.0) ;
        _pos = rotate(_pos, 0.3 * u_time + cos(_pos.x+ u_time));
        

    }
    
    //_pos.y += step(1., mod(_pos.x, 3.)) * 0.5 ;
    vec3 color = vec3 (fract(_pos), index);
    
    return color ;
    
}




void main(){
    vec2 coord = (gl_FragCoord.xy -0.5)/ u_resolution;
    vec3 color = vec3(0.);

    //**
    //coord = coord *2. -1.;

    //coord = coord * (sin(4.*coord +u_time )) ;

    coord += (fract(coord + abs(sin(1.*coord +u_time + length(coord -0.5* cos(0.16* u_time* coord.x))*0.631 )) +length(coord - 0.5*5.)*0.3+sin(sin(u_time*0.3)) )) * .031 ;
    
   
    //**
    vec3 a = patten( coord, 5.);
    vec2 pos = fract(vec2(a.x, a.y));
    
    if (a.z == 1.){
        color = vec3(1. , 0., 0.) * box(pos,vec2(0.8,.8)) * circle(pos, 1.);
    }
    if (a.z == 2.){
        color = vec3(1.0, 0.0, 0.0) * (smoothstep(0.1, 0.02, abs((a.x + a.y) - 0.2 -1.)) + smoothstep(0.1, 0.02, abs((a.x + a.y) + 0.2 -1.)) + smoothstep(0.1, 0.02, abs((a.x + a.y) + 0.5 -1.)));
    }
    if (a.z == 3.){
        color = vec3(0.0784, 0.0706, 0.5059) * ( box(pos,vec2(0.28,.8)) + box(pos, vec2(0.8,.28)) ) * circle(pos, 0.8) *6.;
    }
    if (a.z == 0.){
        color = vec3(0.9451, 0.0, 0.0) * smoothstep(0.1, 0.02, abs((1. - a.x + a.y) -1.));
    }
    
     //color  = patten(coord, 5.) ;
    

    //vec3 color = vec3((coord.x+coord.y) * 0.5) * box(coord,vec2(0.3,.3));

    gl_FragColor = vec4(color,1.);
}