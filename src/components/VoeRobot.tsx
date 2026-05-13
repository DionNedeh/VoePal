import type { Customization, RobotAnimation } from '../types';
import { getShellColor } from '../options';

interface VoeRobotProps {
  customization: Customization;
  animation: RobotAnimation;
}

export function VoeRobot({ customization, animation }: VoeRobotProps) {
  const shell = getShellColor(customization.shell);

  return (
    <div className={`voe-robot ${animation}`} aria-label={`VoePal robot companion, ${animation} animation`}>
      <svg viewBox="0 0 360 360" role="img">
        <defs>
          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <g className="antenna">{renderAntenna(customization.antenna)}</g>
        <g className="arms">{renderArms(customization.arms, shell)}</g>
        <rect className="body-shadow" x="76" y="120" width="208" height="188" rx="64" />
        <rect className="body" x="72" y="112" width="216" height="188" rx="66" fill={shell} />
        <rect className="faceplate" x="108" y="148" width="144" height="80" rx="32" />
        {renderFace(customization.face)}
        {renderAccessory(customization.accessory)}
        <path className="belly-line" d="M132 252h96" />
        <g className="feet">
          <path d="M130 300v28" />
          <path d="M230 300v28" />
        </g>
      </svg>
    </div>
  );
}

function renderAntenna(kind: string) {
  switch (kind) {
    case 'halo':
      return (
        <>
          <path d="M180 108V68" />
          <ellipse cx="180" cy="54" rx="32" ry="14" />
        </>
      );
    case 'bolt':
      return (
        <>
          <path d="M180 108V76" />
          <path className="antenna-fill" d="M168 58h24l-16 22h20l-30 34 10-28h-18z" />
        </>
      );
    case 'twin':
      return (
        <>
          <path d="M156 112V76" />
          <path d="M204 112V76" />
          <circle cx="156" cy="66" r="12" />
          <circle cx="204" cy="66" r="12" />
        </>
      );
    case 'dish':
      return (
        <>
          <path d="M180 108V76" />
          <path d="M152 58c18 20 38 20 56 0" />
          <circle cx="180" cy="76" r="8" />
        </>
      );
    default:
      return (
        <>
          <path d="M180 108V70" />
          <circle cx="180" cy="58" r="14" />
        </>
      );
  }
}

function renderArms(kind: string, shell: string) {
  if (kind === 'wave') {
    return (
      <>
        <path className="arm-line left-arm" d="M78 192c-30-20-40-44-26-72" />
        <path className="arm-line right-arm" d="M282 196c30 0 46-14 54-38" />
        <circle cx="50" cy="118" r="14" fill={shell} />
        <circle cx="336" cy="156" r="14" fill={shell} />
      </>
    );
  }

  if (kind === 'spring') {
    return (
      <>
        <path className="arm-line" d="M76 196c-20 0-26 8-12 18s6 20-14 20" />
        <path className="arm-line" d="M284 196c20 0 26 8 12 18s-6 20 14 20" />
      </>
    );
  }

  if (kind === 'claw') {
    return (
      <>
        <path className="arm-line" d="M78 204H42" />
        <path className="arm-line" d="M282 204h36" />
        <path className="claw" d="M36 190l-18 14 18 14" />
        <path className="claw" d="M324 190l18 14-18 14" />
      </>
    );
  }

  if (kind === 'stubby') {
    return (
      <>
        <path className="arm-line" d="M78 210H52" />
        <path className="arm-line" d="M282 210h26" />
      </>
    );
  }

  return (
    <>
      <path className="arm-line" d="M78 204H38" />
      <path className="arm-line" d="M282 204h40" />
      <circle cx="36" cy="204" r="12" fill={shell} />
      <circle cx="324" cy="204" r="12" fill={shell} />
    </>
  );
}

function renderFace(kind: string) {
  switch (kind) {
    case 'visor':
      return (
        <>
          <path className="eye-line" d="M140 188h80" />
          <path className="mouth" d="M150 210c20 12 40 12 60 0" />
        </>
      );
    case 'sleepy':
      return (
        <>
          <path className="eye-line" d="M136 184c12 10 24 10 36 0" />
          <path className="eye-line" d="M188 184c12 10 24 10 36 0" />
          <path className="mouth" d="M158 210h44" />
        </>
      );
    case 'spark':
      return (
        <>
          <path className="spark-eye" d="M150 170l8 14 14 8-14 8-8 14-8-14-14-8 14-8z" />
          <path className="spark-eye" d="M210 170l8 14 14 8-14 8-8 14-8-14-14-8 14-8z" />
          <path className="mouth" d="M154 214c18 16 34 16 52 0" />
        </>
      );
    case 'retro':
      return (
        <>
          <rect className="retro-eye" x="132" y="176" width="34" height="24" rx="8" />
          <rect className="retro-eye" x="194" y="176" width="34" height="24" rx="8" />
          <path className="mouth" d="M154 216h52" />
        </>
      );
    default:
      return (
        <>
          <circle className="eye" cx="150" cy="188" r="12" />
          <circle className="eye" cx="210" cy="188" r="12" />
          <path className="mouth" d="M152 214c18 18 38 18 56 0" />
        </>
      );
  }
}

function renderAccessory(kind: string) {
  switch (kind) {
    case 'star':
      return <path className="accessory" d="M248 244l8 16 18 2-13 12 4 18-17-9-16 9 3-18-13-12 18-2z" />;
    case 'scarf':
      return <path className="scarf" d="M112 236c48 20 92 20 136 0v24c-44 16-88 16-136 0z" />;
    case 'badge':
      return <rect className="badge" x="222" y="246" width="34" height="26" rx="8" />;
    case 'headset':
      return (
        <>
          <path className="headset" d="M82 190c0-112 196-112 196 0" />
          <rect className="headset" x="58" y="150" width="42" height="82" rx="17" />
          <rect className="headset" x="260" y="150" width="42" height="82" rx="17" />
          <path className="headset-mic" d="M274 226c0 28-18 44-48 46" />
        </>
      );
    default:
      return null;
  }
}
