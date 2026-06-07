const BUCKET_NAME = 'safecdata';
const REGION = 'us-east-1';

const LOCATION_MAP: Record<string, string> = {
  '7th Street Market': '7_street_market',
  'ABC Store': 'abc_store',
  'CPCC': 'cpcc',
  'TeCSAR Lab': 'tecsar_lab',
  'Parking lot': 'parking_lot',
};

const CAMERA_MAP: Record<string, string> = {
  'Camera 1': 'camera1',
  'Camera 2': 'camera2',
  'Camera 3': 'camera3',
  'Camera 4': 'camera4',
  'Camera 5': 'camera5',
  'Camera 6': 'camera6',
  'Camera 7': 'camera7',
  'Camera 8': 'camera8',
};

const getLocalDateStr = (daysAgo: number = 0): string => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toLocaleDateString('en-CA');
};

const getS3Heatmap = async (
  location: string,
  camId: string,
  specificDate?: string
): Promise<string | null> => {
  const locationKey = LOCATION_MAP[location] ?? location.toLowerCase().replace(/\s+/g, '_');
  const cameraKey = CAMERA_MAP[camId] ?? camId.toLowerCase().replace(/\s+/g, '');

  // If specific date passed use it directly
  if (specificDate) {
    const url = `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/heatmap/${locationKey}_${cameraKey}_${specificDate}.png`;
    console.log('Trying specific date:', url);
    try {
      // Use GET not HEAD — some S3 configs block HEAD requests
      const res = await fetch(url, { method: 'GET' });
      if (res.ok) return url;
      return null;
    } catch {
      return null;
    }
  }

  // No date — loop back 30 days using local time
  for (let i = 0; i < 30; i++) {
    const dateStr = getLocalDateStr(i);
    const url = `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/heatmap/${locationKey}_${cameraKey}_${dateStr}.png`;
    console.log(`Trying [${i}]: ${url}`);
    try {
      // Use GET not HEAD
      const res = await fetch(url, { method: 'GET' });
      if (res.ok) {
        console.log(`Found heatmap: ${url}`);
        return url;
      }
    } catch {
      continue;
    }
  }

  console.warn('No heatmap found in last 30 days');
  return null;
};

export default getS3Heatmap;