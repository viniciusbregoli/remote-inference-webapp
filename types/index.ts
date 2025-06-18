export interface BoundingBox {
  id: number;
  class_name: string;
  confidence: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface Detection {
  id: number;
  job_id: string;
  model_name: string;
  image_width: number;
  image_height: number;
  image_hash: string;
  processing_time: number;
  bounding_boxes: BoundingBox[];
}
