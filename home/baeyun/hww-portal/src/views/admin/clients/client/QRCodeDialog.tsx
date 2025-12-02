import React, { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useSnackbar } from "notistack";
import CropFreeIcon from '@material-ui/icons/CropFree';
import { Box, Button, CircularProgress } from "@material-ui/core";
import OpenInNewIcon from '@material-ui/icons/OpenInNew';

export default function QRCodeDialog(): JSX.Element {
  const { id } = useParams(); // clientId
  const { enqueueSnackbar } = useSnackbar();
  const inputRef = useRef(null);
  const [loading, setLoading] = useState<boolean>(false);
  const qrFormData = new FormData();
  const qrCodeImgEl = document.getElementById("qrcode-img");

  const handleImageUploadButton = () => {
    // @ts-ignore
    if (inputRef) inputRef.current.click();
  };

  const onFileChange = async (e: any) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      let imageDataUrl: string = await (new Promise((resolve) => {
        const reader = new FileReader();
        reader.addEventListener("load", () => resolve(reader.result as string), false);
        reader.readAsDataURL(file);
      }));

      setLoading(true);
      fetch(imageDataUrl).then(async (res) => {
        const blob = await res.blob();

        // Check if the blob is an SVG
        if (blob.type === 'image/svg+xml') {
          // Convert SVG to PNG
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 392;
            canvas.height = 509;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0, 392, 509);
            canvas.toBlob((pngBlob) => {
              qrFormData.append("qrcode", pngBlob as Blob, "qrcode.png");
              uploadQRCode(imageDataUrl);
            }, 'image/png');
          };
          img.src = URL.createObjectURL(blob);
        } else {
          qrFormData.append("qrcode", blob);
          uploadQRCode(imageDataUrl);
        }
      });
    }
  };

  const uploadQRCode = (imageDataUrl: string) => {
    axios
      .post(`/api/client/${id}/qrcode`, qrFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(async (response) => {
        setLoading(false);
        if (response.status == 200 || response.status == 201) {
          if (qrCodeImgEl) qrCodeImgEl.setAttribute("src", imageDataUrl);

          enqueueSnackbar("QR Code updated successfully.", {
            variant: "success",
          });
        } else {
          console.log(response);
          enqueueSnackbar(
            "Failed to update QR Code. Contact the developer.",
            {
              variant: "error",
            }
          );
        }
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
        enqueueSnackbar(
          "Failed to update QR Code. Check your network connection and try again.",
          {
            variant: "error",
          }
        );
      });
  };

  return (
    <Box>
      <input
        ref={inputRef}
        type="file"
        name="img"
        accept="image/*"
        onChange={onFileChange}
        style={{ display: "none" }}
      />
      <Button
        onClick={handleImageUploadButton}
        startIcon={loading ? <CircularProgress style={{ color: "rgba(0, 0, 0, 0.87)", width: 24, height: 24 }} /> : <CropFreeIcon />}
        color="default"
        variant="contained"
      >
        Update QR Code
      </Button>
      <Button
        href={`/verify/${id}`}
        target="_blank"
        rel="noopener"
        endIcon={<OpenInNewIcon fontSize="small" />}
        style={{ marginLeft: 10 }}
      >
        Preview
      </Button>
    </Box>
  );
};
