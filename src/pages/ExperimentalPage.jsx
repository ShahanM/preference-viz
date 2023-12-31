import { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';

/*
Path commands
M = moveTo (x, y)
m = moveBy (dx, dy)
L = lineTo (x, y)
l = lineBy (dx, dy)
H = horizontalLineTo (x)
h = horizontalLineBy (dx)
V = verticalLineTo (y)
v = verticalLineBy (dy)
Z = closePath (draws a line from the current point to the last moveTo point)
z = closePath (draws a line from the current point to the last moveTo point)
C = curveTo (x1, y1, x2, y2, x, y) // cubic bezier curve
c = curveBy (dx1, dy1, dx2, dy2, dx, dy) // cubic bezier curve
S = smoothCurveTo (x2, y2, x, y) // smooth cubic bezier curve
s = smoothCurveBy (dx2, dy2, dx, dy) // smooth cubic bezier curve
Q = quadraticBezierCurveTo (x1, y1, x, y) // quadratic bezier curve
q = quadraticBezierCurveBy (dx1, dy1, dx, dy) // quadratic bezier curve
T = smoothQuadraticBezierCurveTo (x, y) // smooth quadratic bezier curve
t = smoothQuadraticBezierCurveBy (dx, dy) // smooth quadratic bezier curve
A = ellipticalArcTo (rx, ry, xAxisRotation, largeArcFlag, sweepFlag, x, y)
a = ellipticalArcBy (rx, ry, xAxisRotation, largeArcFlag, sweepFlag, dx, dy)
*/

export default function Draftboard() {

	// Setting the amount of the coordinate space we want to use as bezelt
	const svgPaddingY = 35;
	const svgPaddingX = 35;

	const maxColorValue = 1; // maximum length of a petal in the Plutchik wheel
	const minColorValue = 0; // minimum length of a petal in the Plutchik wheel

	const wheelRadius = 270; // radius of the Plutchik wheel in pixels

	const stepGranularity = 0.01; // step size for the slider

	// Color values of the petals
	const [yellowValue, setYellowValue] = useState(maxColorValue);
	const [lGreenValue, setLGreenValue] = useState(maxColorValue);
	const [dGreenValue, setDGreenValue] = useState(maxColorValue);
	const [lBlueValue, setLBlueValue] = useState(maxColorValue);
	const [dBlueValue, setDBlueValue] = useState(maxColorValue);
	const [purpleValue, setPurpleValue] = useState(maxColorValue);
	const [redValue, setRedValue] = useState(maxColorValue);
	const [orangeValue, setOrangeValue] = useState(maxColorValue);

	const computerPetalTip = (lengthFactor, angle) => {
		// Scale the length of the petal to the radius of the wheel
		const length = lengthFactor * wheelRadius;
		console.log(length);

		// The petal is at angle radians
		const x = svgPaddingX + wheelRadius - length * Math.sin(angle);
		const y = svgPaddingY + wheelRadius - length * Math.cos(angle);

		return [x, y];
	}

	// Coordinates of the tip of the petals initiliazed at maxColorValue
	const [yellowTip, setYellowTip] = useState([]);
	const [lGreenTip, setLGreenTip] = useState([]);
	const [dGreenTip, setDGreenTip] = useState([]);
	const [lBlueTip, setLGlueTip] = useState([]);
	const [dBlueTip, setDGlueTip] = useState([]);
	const [purpleTip, setPurpleTip] = useState([]);
	const [redTip, setRedTip] = useState([]);
	const [orangeTip, setOrangeTip] = useState([]);

	useEffect(() => {
		setYellowTip(computerPetalTip(yellowValue, 0));
	}, [yellowValue]);

	useEffect(() => {
		setOrangeTip(computerPetalTip(orangeValue, Math.PI / 4));
	}, [orangeValue]);

	// Set of useEffects for dev testing and will be removed later
	useEffect(() => { console.log("yellowTip", yellowTip); }, [yellowTip]);
	
	useEffect(() => { console.log("orangeTip", orangeTip); }, [orangeTip]);
	
	
	return (
		<Container fluid>
			<Row>
				<Col>
					<svg id="draftboard" width="800" height="800">
						<g id="circles" fill="none" stroke="#000" strokeWidth="2">
							<circle id="outer-ring" strokeDasharray="6" cx="357.5" cy="362.5" r="250" />
							<circle id="inner-ring" strokeDasharray="4" cx="357.5" cy="362.5" r="188" />
						</g>
						<g id="areas" stroke="#000" strokeWidth="2">
							<path fill="#FFE854" 
								d="
								M 309.908,247.577
								L 357.512,362.5
								l 47.604-114.923
								C 374.702,234.995,340.319,234.995,309.908,247.577
								z" />
							<path fill="#FFFF54" d="M309.907,247.573l0.002,0.006c14.664-6.081,30.739-9.444,47.604-9.444   c16.854,0,32.922,3.359,47.58,9.437l0.003-0.005c0.008-0.011,0.018-0.021,0.021-0.026c1.304-21.269,2.138-43.636,0.757-66.704   c-30.959-8.268-64.214-8.705-96.679-0.026C307.757,203.847,308.468,226.336,309.907,247.573z" />
							<path fill="#FFFFB1" d="M405.872,180.831c-1.273-21.354-4.456-43.308-10.929-65.544c-24.504-3.734-49.738-3.837-74.904-0.003   c-6.268,21.939-9.5,43.971-10.845,65.519C341.66,172.126,374.916,172.567,405.872,180.831z" />
							<path fill="#FEFFDD" 
								d="
								M 394.948,115.287
								C 387.517,89.74,375.741,63.818,357.512,38
								c -18.155,24.979-29.98,51.066-37.471,77.284
								C 345.206,111.449,370.441,111.552,394.948,115.287
								z" />
							
							<path fill="#C5E2C5" 
								d="
								M 604.723,399.955
								c 26.213-7.488,52.3-19.314,77.277-37.47
								c -25.812-18.227-51.728-29.997-77.269-37.432
								C 608.563,350.221,608.459,375.453,604.723,399.955
								z" />
							<path fill="#8CC68C" d="M539.196,410.803c21.552-1.346,43.584-4.578,65.524-10.848   c3.736-24.502,3.843-49.734,0.013-74.897c-22.233-6.471-44.188-9.651-65.539-10.933   C547.881,346.588,547.452,379.844,539.196,410.803z" />
							<path fill="#009600" d="M472.43,314.882c6.084,14.668,9.449,30.749,9.449,47.618   c0,16.859-3.359,32.932-9.438,47.594c21.231,1.439,43.719,2.148,66.756,0.709c8.258-30.959,8.687-64.215-0.002-96.678   C516.104,312.74,493.713,313.576,472.43,314.882z" />
							<path fill="#008000" d="M472.438,410.104c12.582-30.408,12.582-64.796,0-95.204L357.512,362.5L472.438,410.104z" />
							
							<path fill="#FF8C8C" d="M175.847,314.122c-21.354,1.277-43.308,4.456-65.545,10.926   c-3.737,24.507-3.842,49.743-0.008,74.913c21.939,6.268,43.971,9.496,65.518,10.844   C167.138,378.338,167.578,345.08,175.847,314.122z" />
							<path fill="#FF0000" d="M242.571,410.092l0.011-0.004c-6.076-14.66-9.438-30.729-9.438-47.588   c0-16.866,3.363-32.943,9.445-47.609l-0.021-0.008c-21.271-1.306-43.646-2.141-66.725-0.761   c-8.269,30.958-8.71,64.216-0.036,96.683C198.851,412.242,221.338,411.531,242.571,410.092z" />
							<path fill="#D40000" d="M242.589,314.899c-12.583,30.409-12.583,64.797,0,95.205L357.512,362.5L242.589,314.899z" />
							<path fill="#FFC5C5"
								d="
								M 110.303,325.048 
								C 84.749,332.483, 58.82,344.254, 33,362.488
								c 24.984,18.157, 51.076,29.983, 77.296,37.476
								C 106.462,374.791, 106.564,349.555, 110.303,325.048
								z" />
							
							
							<path fill="#C5C5FF" d="M320.038,609.707c7.489,26.219,19.315,52.309,37.474,77.293   c18.229-25.813,30-51.732,37.436-77.277C369.78,613.553,344.544,613.449,320.038,609.707z" />
							<path fill="#8C8CFF" d="M309.195,544.182c1.346,21.553,4.576,43.582,10.844,65.525   c24.506,3.738,49.741,3.846,74.907,0.016c6.472-22.232,9.647-44.188,10.931-65.535   C373.409,552.869,340.155,552.444,309.195,544.182z" />
							<path fill="#5151FF" d="M405.116,477.428l-0.002-0.004c-14.664,6.08-30.739,9.443-47.604,9.443   c-16.863,0-32.938-3.363-47.604-9.443l-0.002,0.004c-1.438,21.23-2.149,43.721-0.712,66.754c30.96,8.262,64.216,8.689,96.679,0.006   C407.258,521.098,406.422,498.711,405.116,477.428z" />
							<path fill="#0000C8" d="M405.116,477.424L357.512,362.5l-47.604,114.924   C340.319,490.006,374.702,490.006,405.116,477.424z" />
							
							<path fill="#FF7D00" d="M242.589,314.899L357.512,362.5l-47.604-114.923   C279.509,260.183,255.194,284.497,242.589,314.899z" />
							<path fill="#FFA854" d="M242.58,314.886l0.011,0.004c12.606-30.396,36.919-54.708,67.317-67.313   l-0.006-0.018c-14.125-15.968-29.368-32.383-46.669-47.729c-29.093,16.813-52.301,40.631-68.354,68.356   C210.151,285.498,226.552,300.893,242.58,314.886z" />
							<path fill="#FFC48C" d="M263.233,199.834c-16.001-14.192-33.779-27.459-54.076-38.606c-20.498,15.085-38.263,33-52.943,52.968   c11.085,19.946,24.38,37.813,38.667,54C210.934,240.465,234.142,216.649,263.233,199.834z" />
							<path fill="#FFE1C5" d="M209.157,161.228c-23.319-12.811-49.961-22.827-81.104-28.189   c4.828,30.509,14.916,57.321,28.161,81.157C170.896,194.229,188.659,176.313,209.157,161.228z" />
							
							<path fill="#FFE2FF" d="M156.228,510.84c-12.811,23.32-22.829,49.961-28.192,81.107   c30.508-4.828,57.32-14.916,81.155-28.16C189.226,549.108,171.312,531.34,156.228,510.84z" />
							<path fill="#FFC6FF" d="M194.837,456.762c-14.194,16.002-27.461,33.779-38.609,54.078   c15.083,20.5,32.998,38.268,52.963,52.947c19.948-11.084,37.812-24.379,53.999-38.666   C235.463,509.071,211.646,485.86,194.837,456.762z" />
							<path fill="#FF54FF" d="M309.886,477.42l0.003-0.006   c-30.396-12.609-54.704-36.926-67.307-67.326l-0.02,0.008c-15.967,14.123-32.381,29.367-47.726,46.666   c16.811,29.098,40.626,52.309,68.354,68.359C280.494,509.85,295.892,493.449,309.886,477.42z" />
							<path fill="#DE00DE" d="M309.908,477.424L357.512,362.5l-114.923,47.604   C255.194,440.504,279.509,464.821,309.908,477.424z" />
							
							<path fill="#D5EEFF" d="M558.778,510.85c-14.687,19.963-32.447,37.871-52.946,52.951   c23.829,13.238,50.635,23.32,81.135,28.146C581.602,560.807,571.586,534.17,558.778,510.85z" />
							<path fill="#A5DBFF" d="M558.778,510.85c-11.147-20.301-24.416-38.08-38.608-54.084   c-16.048,27.732-39.248,51.559-68.336,68.377c16.188,14.283,34.051,27.576,53.997,38.658   C526.329,548.721,544.094,530.811,558.778,510.85z" />				
							<path fill="#59BDFF" d="M472.438,410.096c-12.604,30.402-36.921,54.723-67.32,67.328   c14,16.035,29.399,32.441,46.716,47.719c29.088-16.818,52.288-40.645,68.336-68.377   C504.821,439.465,488.407,424.221,472.438,410.096z" />						
							<path fill="#0089E0" d="M472.438,410.104L357.512,362.5l47.604,114.924   C435.518,464.821,459.829,440.504,472.438,410.104z" />

							<path fill="#C5FFC5" d="M558.801,214.167c13.237-23.829,23.319-50.634,28.146-81.132   c-31.144,5.362-57.778,15.38-81.103,28.188C525.811,175.906,543.721,193.669,558.801,214.167z" />							
							<path fill="#00B400" d="M357.512,362.5l114.925-47.604   c-12.604-30.397-36.92-54.715-67.319-67.318L357.512,362.5z" />
							<path fill="#54FF54" d="M405.116,247.535c0,0.012,0,0.021-0.002,0.035l-0.003,0.006   c30.396,12.604,54.706,36.908,67.313,67.302c16.034-13.999,32.44-29.401,47.719-46.714c-16.823-29.086-40.647-52.286-68.385-68.329   C434.471,215.173,419.236,231.576,405.116,247.535z" />
							<path fill="#8CFF8C" d="M520.146,268.164c14.28-16.188,27.571-34.053,38.653-53.998   c-15.08-20.498-32.99-38.264-52.955-52.942c-20.301,11.147-38.08,24.417-54.084,38.611   C479.495,215.878,503.321,239.078,520.146,268.164z" />
							
						</g>
						<g id="text" fontFamily="'DejaVu Sans'" fontSize="14">
							<g>
								<text transform="matrix(1 0 0 1 216 117.1)" id="trsvg33"><tspan id="trsvg1">optimism</tspan></text>
								<text transform="matrix(1 0 0 1 456 117.1)" id="trsvg34"><tspan id="trsvg2">love</tspan></text>
								<text transform="matrix(1 0 0 1 10 262.6)" id="trsvg35"><tspan id="trsvg3">aggressiveness</tspan></text>
								<text transform="matrix(1 0 0 1 600 262.6)" id="trsvg36"><tspan id="trsvg4">submission</tspan></text>
								<text transform="matrix(1 0 0 1 45 470.6)" id="trsvg37"><tspan id="trsvg5">contempt</tspan></text>
								<text transform="matrix(1 0 0 1 600 470.6)" id="trsvg38"><tspan id="trsvg6">awe</tspan></text>
								<text transform="matrix(1 0 0 1 220 619.4)" id="trsvg39"><tspan id="trsvg7">remorse</tspan></text>
								<text transform="matrix(1 0 0 1 432 619.4)" id="trsvg40"><tspan id="trsvg8">disapproval</tspan></text>
							</g>
							<g>
								<text transform="matrix(1 0 0 1 89 367.2)" id="trsvg41"><tspan id="trsvg9">annoyance</tspan></text>
								<text transform="matrix(1 0 0 1 182 367.2)" id="trsvg42"><tspan id="trsvg10">anger</tspan></text>
								<text transform="matrix(1 0 0 1 251 367.2)" id="trsvg43"><tspan id="trsvg11">rage</tspan></text>
							</g>
							<g>
								<text transform="matrix(1 0 0 1 265 311.1)" id="trsvg44"><tspan id="trsvg12">vigilance</tspan></text>
								<text transform="matrix(1 0 0 1 215 250.1)" id="trsvg45"><tspan id="trsvg13">anticipation</tspan></text>
								<text transform="matrix(1 0 0 1 178 212.1)" id="trsvg46"><tspan id="trsvg14">interest</tspan></text>
							</g>
							<g>
								<switch><text transform="matrix(1 0 0 1 332 273)" id="trsvg47-zh-hant" systemLanguage="zh-hant"><tspan id="trsvg15-zh-hant">狂喜</tspan></text><text transform="matrix(1 0 0 1 332 273)" id="trsvg47-tr" systemLanguage="tr"><tspan id="trsvg15-tr">coşku</tspan></text><text transform="matrix(1 0 0 1 332 273)" id="trsvg47"><tspan id="trsvg15">ecstasy</tspan></text></switch>
								<switch><text transform="matrix(1 0 0 1 346 214)" id="trsvg48-zh-hant" systemLanguage="zh-hant"><tspan id="trsvg16-zh-hant">喜悅</tspan></text><text transform="matrix(1 0 0 1 346 214)" id="trsvg48-tr" systemLanguage="tr"><tspan id="trsvg16-tr">neşe</tspan></text><text transform="matrix(1 0 0 1 346 214)" id="trsvg48"><tspan id="trsvg16">joy</tspan></text></switch>
								<switch><text transform="matrix(1 0 0 1 329 149)" id="trsvg49-zh-hant" systemLanguage="zh-hant"><tspan id="trsvg17-zh-hant">平靜</tspan></text><text transform="matrix(1 0 0 1 329 149)" id="trsvg49-tr" systemLanguage="tr"><tspan id="trsvg17-tr">sakinlik</tspan></text><text transform="matrix(1 0 0 1 329 149)" id="trsvg49"><tspan id="trsvg17">serenity</tspan></text></switch>
							</g>
							<g>
								<switch><text transform="matrix(1 0 0 1 387 311.1)" id="trsvg50-zh-hant" systemLanguage="zh-hant"><tspan id="trsvg18-zh-hant">敬佩</tspan></text><text transform="matrix(1 0 0 1 387 311.1)" id="trsvg50-tr" systemLanguage="tr"><tspan id="trsvg18-tr">hayranlık</tspan></text><text transform="matrix(1 0 0 1 387 311.1)" id="trsvg50"><tspan id="trsvg18">admiration</tspan></text></switch>
								<switch><text transform="matrix(1 0 0 1 452 250.1)" id="trsvg51-zh-hant" systemLanguage="zh-hant"><tspan id="trsvg19-zh-hant">信任</tspan></text><text transform="matrix(1 0 0 1 452 250.1)" id="trsvg51-tr" systemLanguage="tr"><tspan id="trsvg19-tr">güven</tspan></text><text transform="matrix(1 0 0 1 452 250.1)" id="trsvg51"><tspan id="trsvg19">trust</tspan></text></switch>
								<switch><text transform="matrix(1 0 0 1 471 212.1)" id="trsvg52-zh-hant" systemLanguage="zh-hant"><tspan id="trsvg20-zh-hant">接納</tspan></text><text transform="matrix(1 0 0 1 471 212.1)" id="trsvg52-tr" systemLanguage="tr"><tspan id="trsvg20-tr">kabul</tspan></text><text transform="matrix(1 0 0 1 471 212.1)" id="trsvg52"><tspan id="trsvg20">acceptance</tspan></text></switch>
							</g>
							<g>
								<switch><text transform="matrix(1 0 0 1 428 367.2)" id="trsvg53-zh-hant" systemLanguage="zh-hant"><tspan id="trsvg21-zh-hant">恐懼</tspan></text><text transform="matrix(1 0 0 1 428 367.2)" id="trsvg53-tr" systemLanguage="tr"><tspan id="trsvg21-tr">dehşet</tspan></text><text transform="matrix(1 0 0 1 428 367.2)" id="trsvg53"><tspan id="trsvg21">terror</tspan></text></switch>
								<switch><text transform="matrix(1 0 0 1 498 367.2)" id="trsvg54-zh-hant" systemLanguage="zh-hant"><tspan id="trsvg22-zh-hant">害怕</tspan></text><text transform="matrix(1 0 0 1 498 367.2)" id="trsvg54-tr" systemLanguage="tr"><tspan id="trsvg22-tr">korku</tspan></text><text transform="matrix(1 0 0 1 498 367.2)" id="trsvg54"><tspan id="trsvg22">fear</tspan></text></switch>
								<switch><text transform="matrix(1 0 0 1 550 367.2)" id="trsvg55-zh-hant" systemLanguage="zh-hant"><tspan id="trsvg23-zh-hant">憂慮</tspan></text><text transform="matrix(1 0 0 1 550 367.2)" id="trsvg55-tr" systemLanguage="tr"><tspan id="trsvg23-tr">endişe</tspan></text><text transform="matrix(1 0 0 1 550 367.2)" id="trsvg55"><tspan id="trsvg23">apprehension</tspan></text></switch>
							</g>
							<g>
								<switch><text transform="matrix(1 0 0 1 385 423.1)" id="trsvg56-zh-hant" systemLanguage="zh-hant"><tspan id="trsvg24-zh-hant">驚奇</tspan></text><text transform="matrix(1 0 0 1 385 423.1)" id="trsvg56-tr" systemLanguage="tr"><tspan id="trsvg24-tr">hayret</tspan></text><text transform="matrix(1 0 0 1 385 423.1)" id="trsvg56"><tspan id="trsvg24">amazement</tspan></text></switch>
								<switch><text transform="matrix(1 0 0 1 440 475.4)" id="trsvg57-zh-hant" systemLanguage="zh-hant"><tspan id="trsvg25-zh-hant">驚喜</tspan></text><text transform="matrix(1 0 0 1 440 475.4)" id="trsvg57-tr" systemLanguage="tr"><tspan id="trsvg25-tr">sürpriz</tspan></text><text transform="matrix(1 0 0 1 440 475.4)" id="trsvg57"><tspan id="trsvg25">surprise</tspan></text></switch>
								<switch><text transform="matrix(1 0 0 1 470 525.4)" id="trsvg58-zh-hant" systemLanguage="zh-hant"><tspan id="trsvg26-zh-hant">分心</tspan></text><text transform="matrix(1 0 0 1 470 525.4)" id="trsvg58-tr" systemLanguage="tr"><tspan id="trsvg26-tr">dikkat dağınıklığı</tspan></text><text transform="matrix(1 0 0 1 470 525.4)" id="trsvg58"><tspan id="trsvg26">distraction</tspan></text></switch>
							</g>
							<g>
								<switch><text transform="matrix(1 0 0 1 315 583)" id="trsvg59-zh-hant" systemLanguage="zh-hant"><tspan id="trsvg27-zh-hant">沉思</tspan></text><text transform="matrix(1 0 0 1 315 583)" id="trsvg59-tr" systemLanguage="tr"><tspan id="trsvg27-tr">dalgınlık</tspan></text><text transform="matrix(1 0 0 1 315 583)" id="trsvg59"><tspan id="trsvg27">pensiveness</tspan></text></switch>
								<switch><text transform="matrix(1 0 0 1 334 520)" id="trsvg60-zh-hant" systemLanguage="zh-hant"><tspan id="trsvg28-zh-hant">難過</tspan></text><text transform="matrix(1 0 0 1 334 520)" id="trsvg60-tr" systemLanguage="tr"><tspan id="trsvg28-tr">üzüntü </tspan></text><text transform="matrix(1 0 0 1 334 520)" id="trsvg60"><tspan id="trsvg28">sadness</tspan></text></switch>
								<switch><text transform="matrix(1 0 0 1 344 463)" fill="#FFF" id="trsvg61-zh-hant" systemLanguage="zh-hant"><tspan id="trsvg29-zh-hant">悲傷</tspan></text><text transform="matrix(1 0 0 1 344 463)" fill="#FFF" id="trsvg61-tr" systemLanguage="tr"><tspan id="trsvg29-tr">yas</tspan></text><text transform="matrix(1 0 0 1 344 463)" fill="#FFF" id="trsvg61"><tspan id="trsvg29">grief</tspan></text></switch>
							</g>
							<g>
								<switch><text transform="matrix(1 0 0 1 173 525.4)" id="trsvg62-zh-hant" systemLanguage="zh-hant"><tspan id="trsvg30-zh-hant">無聊</tspan></text><text transform="matrix(1 0 0 1 173 525.4)" id="trsvg62-tr" systemLanguage="tr"><tspan id="trsvg30-tr">bıkkınlık</tspan></text><text transform="matrix(1 0 0 1 173 525.4)" id="trsvg62"><tspan id="trsvg30">boredom</tspan></text></switch>
								<switch><text transform="matrix(1 0 0 1 224 475.4)" id="trsvg63-zh-hant" systemLanguage="zh-hant"><tspan id="trsvg31-zh-hant">噁心</tspan></text><text transform="matrix(1 0 0 1 224 475.4)" id="trsvg63-tr" systemLanguage="tr"><tspan id="trsvg31-tr">tiksinti</tspan></text><text transform="matrix(1 0 0 1 224 475.4)" id="trsvg63"><tspan id="trsvg31">disgust</tspan></text></switch>
								<switch><text transform="matrix(1 0 0 1 269 423.1)" id="trsvg64-zh-hant" systemLanguage="zh-hant"><tspan id="trsvg32-zh-hant">嫌惡</tspan></text><text transform="matrix(1 0 0 1 269 423.1)" id="trsvg64-tr" systemLanguage="tr"><tspan id="trsvg32-tr">nefret</tspan></text><text transform="matrix(1 0 0 1 269 423.1)" id="trsvg64"><tspan id="trsvg32">loathing</tspan></text></switch>
							</g>
						</g>
						<g id="petals" stroke="#f00" strokeWidth="3">
							<path fill="#00FFFF" 
								d={`
									M ${yellowTip[0]}, ${yellowTip[1]}
									c ${50}, ${svgPaddingY + wheelRadius}, ${yellowTip[0] + 50}, ${yellowTip[1] + 50}, ${yellowTip[0] + 50}, ${yellowTip[1] + 50}
								z`}
							/>
							<path fill="#00FF00"
								d={`
									M ${yellowTip[0]}, ${yellowTip[1]}
									C ${yellowTip[0] + 90}, ${yellowTip[1] + 50}, ${yellowTip[0] + 90}, ${yellowTip[1] + (wheelRadius /2) + 50} ${yellowTip[0]}, ${svgPaddingY + wheelRadius}

								z`}
								/>
						</g>
					</svg>
				</Col>
				<Col>
					<Row>
						<Form.Label>Yellow</Form.Label>
						<Form.Range value={yellowValue}
							min={minColorValue} max={maxColorValue}
							step={stepGranularity}
							onChange={(evt) => setYellowValue(evt.target.value)} />
					</Row>
					<Row>
						<Form.Label>Light Green</Form.Label>
						<Form.Range value={lGreenValue}
							min={minColorValue} max={maxColorValue}
							step={stepGranularity}
							onChange={(evt) => setLGreenValue(evt.target.value)} />
					</Row>
					<Row>
						<Form.Label>Orange</Form.Label>
						<Form.Range value={orangeValue}
							min={minColorValue} max={maxColorValue}
							step={stepGranularity}
							onChange={(evt) => setOrangeValue(evt.target.value)} />
					</Row>
				</Col>
			</Row>
		</Container>
	)
}