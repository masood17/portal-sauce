import React, { useState } from "react";
import axios from "axios";
import VerifiedUserOutlinedIcon from "@material-ui/icons/VerifiedUserOutlined";
import { useSnackbar } from "notistack";

import PromptDialog from "../../reviewer/common/PromptDialog";
import LoadingButton from "../../reviewer/common/LoadingButton";

interface RequestHardCopyButtonProps {
  certificateId: number;
}

export default function RequestHardCopyButton({
  certificateId,
}: RequestHardCopyButtonProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [promptOpen, setPromptOpen] = useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleHardCopyRequest = () => {
    setLoading(true);
    axios
      .put(`/api/client/certificate/${certificateId}/request-hard-copy`)
      .then(async (response) => {
        setLoading(false);
        if (response.status == 200 || response.status == 201) {
          setPromptOpen(true);
        } else
          enqueueSnackbar("Failed to request certificate hard copy.", {
            variant: "error",
          });
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
        enqueueSnackbar("Failed to request certificate hard copy.", {
          variant: "error",
        });
      });
  };

  return (
    <>
      <PromptDialog
        open={promptOpen}
        onOk={() => setPromptOpen(false)}
        title="Hard Copy Request Successful!"
        message={
          <p>
            Your hard-copy certificate request has been initiated. Please allow
            up to 24 business hours for a response from our team. Thank You!
          </p>
        }
      />
      <LoadingButton
        loading={loading}
        done={false}
        onClick={handleHardCopyRequest}
        startIcon={<VerifiedUserOutlinedIcon />}
        loadingText="Requesting..."
        variant="contained"
        color="secondary"
      >
        Request Hard Copy
      </LoadingButton>
    </>
  );
}
