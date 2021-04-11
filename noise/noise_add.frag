#ifdef GL_ES
precision mediump float;
#endif
uniform float u_time;
uniform vec2 u_resolution;

float rand(vec2 P ){
    return fract(sin(P.x * 10. + P.y * 200.) * 123453.);
}

//Gradient Noise 
//---如你所见，value noise 看起来非常“块状”。
//为了消除这种块状的效果，在 1985 年 Ken Perlin 开发了另一种 noise 算法 Gradient Noise。
//Ken 解决了如何插入随机的 gradients（梯度、渐变）而不是一个固定值。这些梯度值来自于一个二维的随机函数，返回一个方向（vec2 格式的向量），而不仅是一个值（float格式）。
//

vec2 random2(vec2 st){ // Gradient Noise 的做法
    st = vec2( dot(st,vec2(127.1,311.7)),
              dot(st,vec2(269.5,183.3)) );
    return -1.0 + 2.0*fract(sin(st)*43758.5453123);
} 

float noise2d(vec2 titleP){
    vec2 i_pos = floor(titleP);
    vec2 f_pos = fract(titleP);

    float x = 0.;
    float y = 0.;
    float c = 0.;
    
    vec2 f = f_pos;
    vec2 u = f * f * (3.0 - 2.0 *f); /////cubic curve interptation
    x = mix(rand(i_pos), rand(i_pos + vec2(1., 0.)), u.x);
    y = mix(rand(i_pos + vec2(0., 1.)), rand(i_pos + vec2(1., 1.)), u.x);
    c = mix(x, y, u.y);

    return c;
}

float Gradient_noise2d(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    vec2 u = f*f*(3.0-2.0*f);

    return mix( mix( dot( random2(i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ),
                     dot( random2(i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
                mix( dot( random2(i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ),
                     dot( random2(i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
}

void main(){
    
    vec2 st = (gl_FragCoord.xy  / u_resolution.xy);

    vec2 title5 = st*2. + vec2(u_time *0.2, 0.);
    vec2 title10 = st*4. + vec2(u_time*0.2, 0.);
    vec2 title20 = st*6. + vec2(u_time*0.2, 0.);
    vec2 title30 = st*10. + vec2(u_time*1.2, 0.);

    float c = noise2d(title5)*1. + noise2d(title10)* 0.5 + noise2d(title20)*0.25 + noise2d(title30) * 0.125;
    c /=2.5;

    float c1 = Gradient_noise2d(title5)*1. + Gradient_noise2d(title10)* 0.5 + Gradient_noise2d(title20)*0.25 + Gradient_noise2d(title30) * 0.125;
    c1 /=2.5;
  
//..........distance field draw............. 
    c1 = c1 * 2. - 1.;
    c1 = fract(c1*10.)*10.;

//..........polar system draw...............
    vec2 pos = vec2(c1) - st;
    float r = length(pos) *1.;
    float a = atan(pos.y , pos.x);
    float f = cos(a * 3.);
    c *= (1. - smoothstep(f, f+1., r  ));





   vec3 color = vec3(c*32.,c/2.,0.1) ;

    


    gl_FragColor = vec4(color,1.0);
}