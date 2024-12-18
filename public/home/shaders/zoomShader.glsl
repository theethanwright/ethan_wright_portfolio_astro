uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D texture;

void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec2 zoomCenter = mouse / resolution;
    float distance = length(uv - zoomCenter);
    float zoomFactor = 1.0 + 0.5 * exp(-distance * 10.0);
    vec2 zoomedUV = zoomCenter + (uv - zoomCenter) * zoomFactor;
    gl_FragColor = texture(texture, zoomedUV);
}