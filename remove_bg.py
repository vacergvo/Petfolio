import cv2
import numpy as np
import os

def remove_border_connected_white_bg(image_path, output_path, tolerance=30):
    img = cv2.imread(image_path, cv2.IMREAD_COLOR)
    if img is None:
        print(f"Could not load: {image_path}")
        return

    h, w = img.shape[:2]

    # Make a binary mask of "almost white" pixels
    white_mask = cv2.inRange(img, (255 - tolerance, 255 - tolerance, 255 - tolerance), (255, 255, 255))

    # Create flood fill mask (must be 2 pixels larger than the image)
    flood_mask = np.zeros((h + 2, w + 2), np.uint8)

    # Flood fill from all border pixels
    for y in range(h):
        for x in [0, w - 1]:
            if white_mask[y, x] == 255:
                cv2.floodFill(white_mask, flood_mask, (x, y), 0)

    for x in range(w):
        for y in [0, h - 1]:
            if white_mask[y, x] == 255:
                cv2.floodFill(white_mask, flood_mask, (x, y), 0)

    # Invert mask to get only the white background connected to borders
    background_mask = cv2.bitwise_not(white_mask)

    # Convert original image to BGRA
    img_bgra = cv2.cvtColor(img, cv2.COLOR_BGR2BGRA)

    # Set alpha to 0 where mask is 255 (i.e., border white areas)
    img_bgra[background_mask == 255] = [0, 0, 0, 0]

    cv2.imwrite(output_path, img_bgra)

def process_folder(input_folder, output_folder):
    os.makedirs(output_folder, exist_ok=True)

    for filename in os.listdir(input_folder):
        if filename.lower().endswith(('.jpg', '.jpeg', '.png')):
            in_path = os.path.join(input_folder, filename)
            out_path = os.path.join(output_folder, os.path.splitext(filename)[0] + '.png')
            print(f"Processing {filename}...")
            remove_border_connected_white_bg(in_path, out_path)
    print("Done.")

# === EDIT THESE PATHS ===
input_folder = "images"
output_folder = "lps_img"

process_folder(input_folder, output_folder)
