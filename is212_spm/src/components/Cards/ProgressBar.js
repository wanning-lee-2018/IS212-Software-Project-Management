import ProgressBar from 'react-bootstrap/ProgressBar';

function ProgressBar() {
  const now = 60;
  return <ProgressBar now={now} label={`${now}%`} />;
}

export default {ProgressBar};