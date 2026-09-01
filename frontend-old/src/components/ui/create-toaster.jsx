import { createToaster } from "@chakra-ui/react";

export const toaster = createToaster({
  placement: "bottom-end",
  pauseOnPageIdle: true,
  overlap: true,
  offsets: "20px",
});
