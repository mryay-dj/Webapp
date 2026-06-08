export interface S3Video {
  url: string;
  location: string;
  camera: string;
  date: string;
  fileName: string;
}

const BUCKET_BASE = 'https://safecdata.s3.us-east-1.amazonaws.com/feedbackvideos';

// Known videos in S3 — add more as pipeline writes them
const KNOWN_VIDEOS: S3Video[] = [
  {
    url: `${BUCKET_BASE}/cpcc_camera1_1_2024-03-20.mp4`,
    location: 'CPCC',
    camera: 'Camera 1',
    date: '2024-03-20',
    fileName: 'cpcc_camera1_1_2024-03-20.mp4',
  },
  {
    url: `${BUCKET_BASE}/cpcc_camera1_2_2024-03-20.mp4`,
    location: 'CPCC',
    camera: 'Camera 1',
    date: '2024-03-20',
    fileName: 'cpcc_camera1_2_2024-03-20.mp4',
  },
  {
    url: `${BUCKET_BASE}/cpcc_camera3_1_2024-03-20.mp4`,
    location: 'CPCC',
    camera: 'Camera 3',
    date: '2024-03-20',
    fileName: 'cpcc_camera3_1_2024-03-20.mp4',
  },
  {
    url: `${BUCKET_BASE}/video1.mp4`,
    location: '7th Street Market',
    camera: 'Camera 1',
    date: '2024-07-10',
    fileName: 'video1.mp4',
  },
  {
    url: `${BUCKET_BASE}/video2.mp4`,
    location: '7th Street Market',
    camera: 'Camera 2',
    date: '2024-07-10',
    fileName: 'video2.mp4',
  },
  {
    url: `${BUCKET_BASE}/test1_converted.mp4`,
    location: 'CPCC',
    camera: 'Camera 1',
    date: '2024-12-14',
    fileName: 'test1_converted.mp4',
  },
  {
    url: `${BUCKET_BASE}/test2.mp4`,
    location: 'CPCC',
    camera: 'Camera 2',
    date: '2024-12-13',
    fileName: 'test2.mp4',
  },
  {
    url: `${BUCKET_BASE}/test3.mp4`,
    location: 'CPCC',
    camera: 'Camera 3',
    date: '2024-12-14',
    fileName: 'test3.mp4',
  },
];

const getS3Videos = async (location: string): Promise<S3Video[]> => {
  if (location === 'All' || !location) return KNOWN_VIDEOS;
  return KNOWN_VIDEOS.filter(v => v.location === location);
};

export default getS3Videos;