#ifdef GL_ES
precision mediump float;
#endif
 uniform float u_time;
 uniform vec2 u_resolution;



 float random(vec2 st){
     st = fract(st * vec2(234.33, 453.34));
     st += dot(st, st+34.33);

     return fract(st.x * st.y) ;

}

 void main(){

     vec2 st = gl_FragCoord.xy  / u_resolution.xy;
     vec2 pos = st * 5.;
     st = fract(pos) - 0.5; // make orignal in the middle , orignal orignal was in the left bottom  ->   st.x -0.5 -- 0.5 ; st.y -0.5 -- 0.5 ; 

     vec3 color = vec3 (0.);
     if (st.x > 0.48 || st.y > 0.48) color = vec3(0.0, 0.5176, 1.0); // draw red outine 

    st.x *= -1.; // flip the line direction 
    vec2 ipos =  floor(pos);
    vec2 fpos = fract(pos);

    float flip_seed = random(ipos);    // return random number between 0 1 
    float flip_seed_float = random(fpos);

    if (flip_seed < 0.5) st.x *= -1. ;

    float offest = 0.5;
    //float d = abs(abs(st.x + st.y) - offest ); // make line -> ofsset line using (- width) -> abs() duplicate line both side // 
   
   //circle my way 
    //vec3 d = (1. -step (length(st - 0.4), 0.4)) * step(length(st - 0.35),0.4) * vec3(0.0784, 0.3294, 0.8745);
    //d += (1. -step (length(st + 0.4), 0.4)) * step(length(st + 0.35),0.404) * vec3(0.0, 0.2431, 0.4667) ;
    //d += step(length(st - 0.4), 0.3) * vec3(0.8745, 0.0784, 0.0784);

   /*
   //circle shader toy way 普通方法， 两次的draw circle 和 d。 
   float circle_line_width = 0.1;
   float circle = (length(st - 0.5)-0.5);
   vec3 d = vec3(smoothstep(.01,-.01 , abs(circle) - circle_line_width ));
   //// copy circle to other direction
    circle = (length(st + 0.5)-0.5);
    d += vec3(smoothstep(.01,-.01 , abs(circle) - circle_line_width ));
    */

   
    //circle 高级高效的绘制法， 利用x+y 形成对角线结构， 图像左半部分是 负数值， 右半部分是正数值，然后circle便宜点随着正负这些变换
    //具体分析 详细见    https://youtu.be/2R7h76GoIJM?t=1101
    float flip = sign(st.x + st.y +0.001) ; //加上0.001 因为sign除了返回正负以外，还返回0. 会在图像的对角线里出现一条不需要的线， 加很小一个数 可以偏移了0.
    float circle_line_width = 0.1;
    vec2 cUv = st - 0.5 * flip;
    float circle = (length(cUv)-0.5);
    vec3 d = vec3(smoothstep(.01,-.01 , abs(circle) - circle_line_width ));
    
    ////make it move 
    // 1) use polar system to get uv space of this curve. 
    float angle = atan(cUv.x , cUv.y);  // -pi -- pi
    
    // 2)animation test . result not we want
    //float anim = sin(angle * 23.+ u_time*4.);
   
    // 3) animation fix , 做棋盘格
    /*
            ||
        1   ||  -1
    --------------------
        -1  ||  1
            ||
    */
    float anim_fix = mod(ipos.x+ipos.y,2.); //   0 -- 1
    anim_fix = anim_fix *2. -1.;           //    -1 -- +1
   
    float anim = sin(angle * anim_fix * 23.+ u_time*4.);




/*
    for (float i = 0.0; i<23.0; i++){
        float rand_pos = random(ipos * i);
        d += step(length(st - 0.4), 0.15) + step(length(st + vec2(rand_pos,0.1*sin(u_time)+rand_pos) ), 0.04)  * vec3(0.9412, 0.5059, 0.102);
    }
*/


    //d += step(length(st - 0.4), 0.15) + step(length(st + 0.45 *flip_seed ), 0.04)  * vec3(0.9412, 0.5059, 0.102);
    //length(st - 0.25) * 

    //float line_width = 0.25;
    //float line_mask =  smoothstep(0.02, -0.02, d - line_width  ); // - line_width means thickness of line, move abs() value down. //改变了绝对值函数（v型函数，向y轴线偏移，数值变宽。 

    //color += vec3(line_mask);
    color += d * anim;
    //color = vec3(flip_seed);
    
    //test checker board
    //color = vec3(anim_fix);






     gl_FragColor = vec4(color,1.0);
 }


