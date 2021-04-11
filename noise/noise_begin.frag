#ifdef GL_ES
precision mediump float;
#endif
uniform float u_time;
uniform vec2 u_resolution;

float rand(vec2 P ){
    return fract(sin(P.x * 10. + P.y * 200.) * 123453.);
}

void main(){
    
    vec2 st = (gl_FragCoord.xy  / u_resolution.xy);
    vec2 titleP = st*20.;
    
    vec2 i_pos = floor(titleP);
    vec2 f_pos = fract(titleP);

    float x = 0.;
    float y = 0.;
    float c = 0.;

    //////linear interptation ////
    // x = mix(rand(i_pos), rand(i_pos + vec2(1.,0.)), f_pos.x);
    // y = mix(rand(i_pos + vec2(0.,1.)), rand(i_pos + vec2(1.,1.)), f_pos.x);
    // c = mix(x,y,f_pos.y);


    //////smooth interptation////
    // x = mix(rand(i_pos), rand(i_pos + vec2(1.,0.)), smoothstep(0.,1.,f_pos.x));
    // y = mix(rand(i_pos + vec2(0.,1.)), rand(i_pos + vec2(1.,1.)), smoothstep(0.,1.,f_pos.x));
    // c = mix(x,y,f_pos.y);

    //////cubic curve interptation
    vec2 f = f_pos;
    vec2 u = f * f * (3.0 - 2.0 *f);
    x = mix(rand(i_pos), rand(i_pos + vec2(1., 0.)), u.x);
    y = mix(rand(i_pos + vec2(0., 1.)), rand(i_pos + vec2(1., 1.)), u.x);
    c = mix(x, y, u.y);




    float noiseX = x ;
    float noiseY = y;
    vec3 color = vec3(c);





    gl_FragColor = vec4(color,1.0);
}