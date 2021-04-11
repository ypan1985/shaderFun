#ifdef GL_ES
precision mediump float;
#endif
 uniform float u_time;
 uniform vec2 u_resolution;

float random (vec2 st){
    return fract(sin(dot(st.xy , vec2(12.9898,78.233) ) )* 43758.5453123 );
}

vec2 rotate(vec2 st, float angle){
    angle = radians(angle);
    st -= 0.5;
    st = mat2(cos(angle), -sin(angle), sin(angle), cos(angle)) * st;
    st+= 0.5;

    return st;
}

mat2 scale(vec2 _scale){
    return mat2(_scale.x,0.0,
                0.0,_scale.y);
}

float line(vec2 st){
    st -= 0.5;
    vec2 st_a = st + vec2(0.0, 0.05);
    vec2 st_b = st  + vec2(0.0, -0.5);
    vec2 st_c = st  + vec2(0.0, 0.35);
    vec2 st_d = st  + vec2(0.0, -0.25);

    
    float line1 = smoothstep(0.01,0.03,abs(st_a.x + st_a.y));
    float line2 = smoothstep(0.01,0.03,abs(st_b.x + st_b.y));
    float line3 = smoothstep(0.01,0.03,abs(st_c.x + st_c.y));
    float line4 = smoothstep(0.01,0.03,abs(st_d.x + st_d.y));

    return   line1 * line2 * line3 * line4 ;
}


 void main(){

     vec2 st = gl_FragCoord.xy / u_resolution.xy;
     
     st *= 20.;

     vec2 ipos = floor(st);
     vec2 fpos = fract(st);
     vec3 c = vec3(random(ipos));

     float dis = length(st);

     if (c.x > 0.75){
         
         fpos =   rotate(fpos, 45.)  ;
         fpos = scale(vec2(1.,1.))  * fpos;
         vec3 color = line(fpos) * vec3(0.0118, 0.2902, 0.5451) ;
         gl_FragColor = vec4(color,1.0);
     }

     else if (c.x > 0.45){
         fpos =  rotate(fpos, -45.);
         vec3 color = vec3(0.0118, 0.2902, 0.5451) * line(fpos);
         gl_FragColor = vec4(color,1.0);
     }

     else if (c.x < 0.2){
         fpos =  rotate(fpos, 0.);
         vec3 color = vec3(0.0118, 0.2902, 0.5451);
         gl_FragColor = vec4(color,1.0) * line(fpos);
     }
     else{
         fpos =  rotate(fpos, 90.);
         vec3 color = vec3(0.0118, 0.2902, 0.5451);
         gl_FragColor = vec4(color,1.0) * line(fpos);
     }

    
    

     
     //vec3 color = vec3(st.x,st.y,0);

     //gl_FragColor = vec4(color,1.0);

 }