// @ts-nocheck
import React, { useRef, useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { getOrientation } from "get-orientation/browser";
import { getCroppedImg, getRotatedImage } from "./canvasUtils";
import {
  Slider,
  Button,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  makeStyles,
  ButtonProps,
} from "@material-ui/core";

const ORIENTATION_TO_ANGLE = {
  "3": 180,
  "6": 90,
  "8": -90,
};

interface PicSelectorProps {
  onSelect: (imgSrc: string) => void;
  cropOptions?: CropperProps;
  btnText?: string;
  btnProps?: ButtonProps;
}

export default function PicSelector({
  onSelect,
  cropOptions,
  btnText = "Upload picture",
  btnProps = {}
}: PicSelectorProps) {
  const classes = useStyles();
  const inputRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [open, setOpen] = useState(false);

  const handleClose = useCallback(() => {
    setCroppedImage(null);
    setOpen(false);
  }, []);

  const handleImageUploadButton = () => {
    if (inputRef) inputRef.current.click();
  };

  const onFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      let imageDataUrl = await readFile(file);

      // apply rotation if needed
      const orientation = await getOrientation(file);
      const rotation = ORIENTATION_TO_ANGLE[orientation];
      if (rotation) {
        imageDataUrl = await getRotatedImage(imageDataUrl, rotation);
      }

      setImageSrc(imageDataUrl);
      setOpen(true);
    }
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const saveCroppedImage = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation
      );
      setCroppedImage(croppedImage);
      onSelect(croppedImage);
    } catch (e) {
      console.error(e);
    }
    setOpen(false);
  }, [imageSrc, croppedAreaPixels, rotation]);

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="profile-pic-dialog-title"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="profile-pic-dialog-title">
          <Typography variant="h4">Crop your picture</Typography>
        </DialogTitle>
        <DialogContent style={{ position: "relative", height: 400 }}>
          <Cropper
            image={imageSrc}
            crop={crop}
            rotation={rotation}
            zoom={zoom}
            // aspect={4 / 3}
            // showGrid={false}
            // cropShape="round"
            onCropChange={setCrop}
            onRotationChange={setRotation}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            {...cropOptions}
          />
        </DialogContent>
        <DialogContent>
          <div className={classes.controls}>
            <div className={classes.sliderContainer}>
              <Typography classes={{ root: classes.sliderLabel }}>
                Zoom
              </Typography>
              <Slider
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                aria-labelledby="Zoom"
                classes={{ root: classes.slider }}
                onChange={(e, zoom) => setZoom(zoom)}
              />
            </div>
            <div className={classes.sliderContainer}>
              <Typography classes={{ root: classes.sliderLabel }}>
                Rotate
              </Typography>
              <Slider
                value={rotation}
                min={0}
                max={360}
                step={1}
                aria-labelledby="Rotation"
                classes={{ root: classes.slider }}
                onChange={(e, rotation) => setRotation(rotation)}
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={saveCroppedImage}
            variant="contained"
            color="primary"
            classes={{ root: classes.cropButton }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <input
        ref={inputRef}
        type="file"
        name="img"
        accept="image/*"
        onChange={onFileChange}
        style={{ display: "none" }}
      />
      <Button
        color="secondary"
        fullWidth
        variant="text"
        onClick={handleImageUploadButton}
        {...btnProps}
      >
        {btnText}
      </Button>
    </>
  );
}

function readFile(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result), false);
    reader.readAsDataURL(file);
  });
}

const useStyles = makeStyles((theme) => ({
  cropContainer: {
    position: "relative",
    width: "100%",
    height: 200,
    background: "#333",
    [theme.breakpoints.up("sm")]: {
      height: 400,
    },
  },
  cropButton: {
    flexShrink: 0,
    marginLeft: 16,
  },
  controls: {
    padding: 16,
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    [theme.breakpoints.up("sm")]: {
      flexDirection: "row",
      alignItems: "center",
    },
  },
  sliderContainer: {
    display: "flex",
    flex: "1",
    alignItems: "center",
  },
  sliderLabel: {
    [theme.breakpoints.down("xs")]: {
      minWidth: 65,
    },
  },
  slider: {
    padding: "22px 0px",
    marginLeft: 32,
    [theme.breakpoints.up("sm")]: {
      flexDirection: "row",
      alignItems: "center",
      margin: "0 16px",
    },
  },
}));
