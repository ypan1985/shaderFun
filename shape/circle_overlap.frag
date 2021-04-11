#ifdef GL_ES
precision mediump float;
#endif

#define S(a, b, t) smoothstep(a, b, t)    // 不需要再写smoothstep，以后用S代替

 
 uniform float u_time;
 uniform vec2 u_mouse;
 uniform vec2 u_resolution;

 void main(){
     int title_num =12;
     //float m2 = 0.;

    vec2 st = ((gl_FragCoord.xy  / u_resolution.xy) * 2. -1.) ;
    vec2 uv = (gl_FragCoord.xy  / u_resolution.xy)* float(title_num);
    vec2 gv = fract(uv) ;
    vec2 id = floor(uv);

    float dist = length(gv -0.5);
    vec3 color = vec3(0.098, 0.1059, 0.5804);
    //int i = 0;
    float pa = float(title_num);
    float space_number = 1.;


    
    for (int i = 0; i <title_num; i++){
        for(int j= 0; j <title_num; j++){

            if(id.x == float(i)+float(j)  && id.y == float(i)* space_number - float(j) ){
            color = vec3(0.7608, 0.0, 0.0);

            
            }           
        }       
    }


    //vec3 color = vec3(uv.x, uv.y,1.)/10. ;
    gl_FragColor = vec4(color,1.0);
 }