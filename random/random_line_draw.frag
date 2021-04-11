#ifdef GL_ES
precision mediump float;
#endif

#define S(a, b, t) smoothstep(a, b, t)    // 不需要再写smoothstep，以后用S代替

 
 uniform float u_time;
 uniform vec2 u_resolution;

float DistLine(vec2 P, vec2 a, vec2 b){
    vec2 ap = P - a ; 
    vec2 ab = b - a;
    float t = clamp(dot(ap, ab) / dot(ab,ab), 0.,1.);   // line segmet ? why? 

    return length(ap - ab*t);
}

float N21 (vec2 P){
    P = fract(P * vec2(123.13, 423.23));
    P += dot(P, P +12.324);

    return fract(P.x * P.y);
}   // 用另一种办法做random， 而不是用 sin 函数来做， 还不知道优势是什么
    // 参考视频教程 https://www.youtube.com/watch?v=3CycKKJiwis

vec2 N22 (vec2  P){
    float n = N21(P);
    return vec2(n, N21(P + n));
} 

 vec2 getPos(vec2 id, vec2 offest){
    /*
    float x = N22(id + offest).x- 0.5;
    float y = N22(id + offest).y- 0.5;
    float speed = smoothstep(1.8,1.0,N21(id+ offest )+110.8); // 0-1 
    vec2 pos = vec2(sin(x*u_time), cos(y+u_time)) * 0.4 ;
    pos += offest;

    return pos;
    */

    vec2 n = N22(id+offest)*u_time;
    return offest + sin(n) * .23;
 }

float debug_frame_line(vec2 gv){
    float debug_line = 0.;
    if(gv.x > 0.48 || gv.y >0.48){ // 判断gv每个方框的xy值 方框范围（-0.5， 0.5）
         debug_line = 1.;
    }

    return debug_line;
    //画出方框
}

float Line(vec2 p, vec2 a, vec2 b){
    //float d = DistLine(p, vec2(0.), vec2(1.,.4));
    float d = DistLine(p, a, b);
    float m = S(0.01, 0.005, d);
    return m;
}

 void main(){
     float title_num = 10.;
     //float m2 = 0.;

    vec2 st = ((gl_FragCoord.xy  / u_resolution.xy) * 2. -1.) ;
    vec2 uv = (gl_FragCoord.xy  / u_resolution.xy)* title_num;
    vec2 gv = fract(uv) - 0.5;
    vec2 id = floor(uv);

    //////draw random dot pos, 这个先为了测试用，等下会把这个思路放到arrary中 存储位置p
    /*
    vec2 rand_pos = getPos(id, vec2(0.4,0.0));
    float dis = length(gv - rand_pos);
    m2 = S(0.1, 0.05, dis);
    */
    //////

    //get position to arrary 
    vec2 p[9];
    int i = 0;
    for(float y = -1.0; y<1.0; y++){
        for(float x = -1.0; x<1.0; x++){

            //p[i] = getPos(id); //this is for the currect pos, we need caulate this by neightbor offest. 
            p[i] = getPos(id, vec2(x, y));
            i++;
        }
    }

    //read pos and draw the line
    float m = 0.0;
    for (int i = 0; i<19; i++){
        vec2 rand_pos = getPos(id, vec2(0.0,0.0));
        float dis = length(gv - rand_pos);
        m = S(0.08, 0.05, dis);

        m += Line(gv, p[i], p[2]);
        m += Line(gv, p[3], p[1]);
    }



    //float d = DistLine(st, vec2(0.), vec2(1.,.4));
    //float m = S(.002, 0.001, d);
    //float rand = N22(st).x;
    //float frame = debug_frame_line(gv);

    //vec3 color = vec3(0.9765, 0.9804, 1.0) * m2 ;
    //color = vec3(rand); random function draw debug
    //color +=   vec3(frame, 0. ,0.);
    //color = vec3(id.x, id.y, 0.) * (1./title_num);
    vec3 color = vec3(m) + ( debug_frame_line(gv) * vec3(1., 0., 0.));
    gl_FragColor = vec4(color,1.0);
 }