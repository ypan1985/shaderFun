#ifdef GL_ES
precision mediump float;
#endif

const float PI = 3.14159265359;
#define TWO_PI 6.28318530718
#define resolution vec2(500.0, 500.0)
#define Thickness 0.003

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float curveAnim (float segment, float speed,float moving_segment){
    vec2 coord = gl_FragCoord.xy / u_resolution;
    vec2 pos = coord * 2. -1. ;
    float curve = sin(pos.x * segment + sin(u_time + pos.y * moving_segment + cos(pos.x * 30.+ u_time *speed) ))*.5 ;
    curve = smoothstep(0.45, 0.54, curve); 

    return curve;

}

float polygonShape(vec2 position, float radius, float sides, float curve){
    
    position = position * 2.0 - 1.0;
    float angle = atan(position.x, position.y);
    float slice = PI * 2.0 / sides;
    return step(radius, cos(floor(0.5 + angle / slice) * slice - angle) * length(position));
}

float polarShape(vec2 position, float radius, float distord){
    position = position * 2.0 - 1.0;
    float r = length(position)* radius;
    float angle = atan(position.x, position.y);
    float f = abs(cos(angle*4.))*distord+.3;

    float mask = float( 1.-smoothstep(f,f+0.02,r) );
    return mask;
    
}

mat2 rotation2d(float angle){
    return mat2(cos(angle), -sin(angle),
                sin(angle), cos(angle));
    
}

vec2 tranform2d(float x, float y){
    return vec2(x,y);
}

mat2 scale2d(float x, float y){
    return mat2(x, 0.0, 
                0.0, y);
}

vec2 repeat(vec2 _pos, float _zoom){
    _pos *=_zoom;
    _pos.x = step(1., mod(_pos.y,2.)) * 0.5;

    return fract(_pos);
}//not work


void main()
{ 
    vec2 coord = (gl_FragCoord.xy / u_resolution) *4. ;
    vec2 position = fract(coord)  ;
    position -= (0.5 + tranform2d(0.01,0.01)) ;
    position = scale2d(0.45,0.45) * rotation2d(.4+u_time*2.) * (position)  ;
    position += vec2(0.5);
    

    float curve = curveAnim(312.,5.,32.);
    float curve2 = curveAnim(3.,4.,12.);
    


    float polygon = polygonShape(vec2(curve,curve2),curve , 9., curve);
    float polygon2 = polygonShape(position,curve ,2.,curve);
    float polarShape = polarShape(position , 3.,polygon2 + sin(curve+u_time));
    

    
    
    
    


    gl_FragColor = vec4(vec3(polarShape), 1.);

}