#ifdef GL_ES
precision mediump float;
#endif

#define TWO_PI 6.28318530718

uniform vec2 u_resolution;
uniform float u_time;

 

vec3 colorA = vec3(0.149,0.141,0.912);
vec3 colorB = vec3(1.000,0.833,0.224);

vec3 demoColorGrid (vec2 coord){
	vec3 my_vec1 = vec3(1.,-1.,0.);
	vec3 my_vec2 = vec3(-.1,-.5,1.);
    float whitePt = 1.0/sqrt(3.0);
    vec3 whiteBase = vec3(whitePt);
    my_vec1= normalize(my_vec1);
    my_vec2= normalize(my_vec2);
    return whiteBase + coord.x * my_vec1 + coord.y* my_vec2;
}

float circle(in vec2 _st,float pos_x, float pos_y, float radius){
    
    return step(radius, distance( _st,vec2(pos_x,pos_y)));
}

float ploar(float x, float y,float speed, float wide, float falloff, float line_num){
    float a = atan(x,y);
    float r = length(vec2(x,y)) * 1.8;
    float ff = abs(cos(a * line_num + u_time*speed)*sin(a +11.3+cos(u_time*speed)))* wide + falloff;
    float f = smoothstep(-.5,1., cos(a*10.))*0.2+0.5 *cos(ff*4.0);
    return 1. - smoothstep(f-0.2,f+0.19 , r);
}

float fan(float x,float y, float number){
    
    
    vec2 pos = vec2(0.5) - vec2(x,y);
    float r = length(pos) * 2.;
    float a = atan(pos.x,pos.y);
    float f = cos(a * number);
    return smoothstep(f,f+0.02,r);

}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    float black_wide = 0.123;
    float x = smoothstep(0.1,black_wide ,st.x-0.1 )*smoothstep(0.1,black_wide ,1.0 - st.x );
    float y = smoothstep(0.1,black_wide ,st.y-0.25 )*smoothstep(0.1,black_wide ,1.0 - st.y );
    //float circle = 1.0 - step(0.1,distance(st,vec2(0.2)));
    float circle_ramp = smoothstep(0.19,0.58, fract(abs(distance(st,vec2(0.5))*4.5)));
    //vec3 color = vec3(circle(st,0.5,0.5,0.1));


    vec2 toCenter = 0.5 - st;
    float radius = smoothstep(0.13,0.13,length(toCenter)*1.5);
    float radius2 = smoothstep(0.23,0.13,length(toCenter)*9.);

    //vec3 color = vec3(ploar(toCenter.x,toCenter.y+cos(st.x))/TWO_PI+.5,radius,radius);

    //debug 
    float clamp_shape = clamp((u_time)*17.,2.,10.);
    float mask = ploar(toCenter.x, toCenter.y, 1.0, 0.1, 58.33, 5.);
    float mask2 = ploar(toCenter.x, toCenter.y, 1.0, clamp_shape +cos(radius2*st.x*radius*6.*st.y), -0.7, 5.);
    float mask3 = fan(st.x, st.y, 11.);
    vec3 color = mix(vec3(0.0196, 0.0196, 0.0196), vec3(0.1961, 0.1137, 0.3451) ,mask*2.+ mask2*1.20 +mask3);



    gl_FragColor = vec4(color,1.0);
}
