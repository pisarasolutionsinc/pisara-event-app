export interface DragAndDropFileUploadProps {
  onFileUpload: (files: File[]) => void;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
}
