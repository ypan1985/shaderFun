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

float ploar(float x, float y,float speed, float wide, float falloff){
    float a = atan(x,y);
    float r = length(vec2(x,y)) * 1.3;
    float ff = abs(cos(a * 3.+u_time*speed)*sin(a +11.3+cos(u_time*speed)))* wide + falloff;
    float f = smoothstep(-.5,1., cos(a*10.))*0.2+0.5 *cos(ff*4.0);
    return 1. - smoothstep(f-0.2,f+0.19 , r);
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
    float radius = smoothstep(0.3,0.33,length(toCenter)*7.5);
    float radius2 = smoothstep(0.3,0.13,length(toCenter)*1.);

    //vec3 color = vec3(ploar(toCenter.x,toCenter.y+cos(st.x))/TWO_PI+.5,radius,radius);

    //debug 
    float mask = ploar(toCenter.x, toCenter.y, 2.0, 0.8, 0.33);
    float mask2 = ploar(toCenter.x, toCenter.y, -1.4, 0.32+cos(radius2*st.x*radius*24.*st.y), 0.5);
    
    vec3 color = mix(vec3(0.03,0.1,0.2), vec3(0.54,0.74,0.85) ,mask*0.+mask2*1.0);



    gl_FragColor = vec4(color,1.0);
}
