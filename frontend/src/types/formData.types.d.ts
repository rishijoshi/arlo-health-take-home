export interface IUser {
    id: string;
    name: string;
    email: string;
    formData: IFormBlock;
}

export interface IUserContextProps {
    user: User | null;
    setUser: (user: User | null) => void;
}

export interface IQuestion {
  id: string;
  label: string;
  type: string;
  required: boolean;
  placeholder?: string;
  value?: string | boolean;
}

export interface ISection {
  id: string;
  label?: string;
  subHeader?: string;
  text?: string;
  type?: string;
  questions?: IQuestion[];
  tableColumns?: string[];
  signatureDisclosure?: string[];
  signatureBoldSubtext?: string;
  blocks?: {
    type: string;
    fields: IQuestion[];
  }[];
}

export interface IFormBlock {
  header: string;
  id: string;
  sections: (ISection | IQuestion)[];
}

export interface IPDFDocumentProps {
  header: string;
  id: string;
  sections: {
    id: string;
    label?: string;
    subHeader?: string;
    text?: string;
    value?: string;
    questions?: {
      id: string;
      label: string;
      type: string;
      required: boolean;
      value: string;
    }[];
    signatureDisclosure?: string[];
    signatureBoldSubtext?: string;
    blocks?: {
      type: string;
      fields: {
        id: string;
        label: string;
        type: string;
        required: boolean;
        placeholder?: string;
        disabled?: boolean;
        value?: string;
      }[];
    }[];
  }[];
}

export interface ISignatures {
  [key: string]: string;
}

export interface ISignatureRefs {
  contractHolderSigRef: React.RefObject<SignatureCanvas>;
  agencySigRef: React.RefObject<SignatureCanvas>;
}

export interface InputTextProps {
    question: {
        id: string;
        label: string;
        type: string;
        placeholder?: string;
        required: boolean;
    };
    formValue: { [key: string]: string };
    handleInputChange: (id: string, value: string) => void;
}

interface IRadioGroupProps {
    question: {
        id: string;
        required: boolean;
    };
    formValue: { [key: string]: string };
    handleInputChange: (id: string, value: string) => void;
}
