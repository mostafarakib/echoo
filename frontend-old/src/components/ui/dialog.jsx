import { createOverlay, Dialog, Portal } from "@chakra-ui/react";

const dialog = createOverlay((props) => {
  const { title, description, content, ...rest } = props;
  return (
    <Dialog.Root {...rest}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner alignItems={"center"}>
          <Dialog.Content>
            {title && (
              <Dialog.Header
                fontFamily={"Work sans"}
                fontSize={"35px"}
                justifyContent={"center"}
              >
                <Dialog.Title>{title}</Dialog.Title>
              </Dialog.Header>
            )}
            <Dialog.Body spaceY="4">
              {description && (
                <Dialog.Description>{description}</Dialog.Description>
              )}
              {content}
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
});

export { dialog };
