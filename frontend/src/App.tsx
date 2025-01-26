import { useEffect, useState, useRef } from 'react'
import './App.css';
import { pdf } from "@react-pdf/renderer";
import { IFormBlock, IQuestion, ISection, ISignatures, IPDFDocumentProps } from './types/formData.types';
import PDFDocument from "./components/pdfDocument";
import SignatureCanvas from "react-signature-canvas";
import RadioGroup from './components/radioGroup';
import InputText from './components/inputText';
import { useUser } from './hooks/useUser';

function App() {

  const [pdfFormData, setpdfFormData] = useState<IFormBlock[]>([]);
  const [pdfUrl, setPdfUrl] = useState(false);
  const [updatedFormValue, setUpdatedFormValue] = useState<IPDFDocumentProps[]>([]);
  const [formValue, setFormValue] = useState<{ [key: string]: string }>({})
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [signatures, setSignatures] = useState<ISignatures>({});
  const agencySigRef = useRef<SignatureCanvas>(null);
  const contractHolderSigRef = useRef<SignatureCanvas>(null);
  const { user, setUser } = useUser();

  const handleInputChange = (id: string, value: string) => {
    setFormValue((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  // // Select all "Yes"
  // const handleSelectAll = () => {
  //   const updatedAnswers = pdfFormData.reduce((acc: { [key: string]: string }, block) => {
  //     block.sections.forEach((section: ISection) => {
  //       section.questions?.forEach((question: IQuestion) => {
  //         if (question.type === 'radio') {
  //           acc[section.id] = section.id;
  //           acc[question.id] = 'yes';
  //         }
  //       });
  //     });
  //     return acc;
  //   }, {});
  //   setFormValue(updatedAnswers);
  // };

  // // Deselect all (reset)
  // const handleDeselectAll = () => {
  //   const updatedAnswers = pdfFormData.reduce((acc: { [key: string]: string }, block) => {
  //     block.sections.forEach((section: ISection) => {
  //       section.questions?.forEach((question: IQuestion) => {
  //         if (question.type === 'radio') {
  //           acc[question.id] = 'no';
  //         }
  //       });
  //     });
  //     return acc;
  //   }, {});
  //   setFormValue(updatedAnswers);
  // };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // just a mock of fetching user data based on Id. Maybe you can get it from oAuth, Auth0 or some other IAM.
        const response = await fetch('http://localhost:3000/user?id="aa823528-7a5d-4332-bc7b-26bf914fac0d"');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setUser(data.userInfo);
        setpdfFormData(data.userInfo.formData);
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
      }
    };

    fetchData();
  }, [setUser]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:3000/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formValue),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      if (response.ok) {
        const data = await response.json();

        setUpdatedFormValue((prevState) => [...prevState, ...data]);
        setPdfUrl(true);
        if (updatedFormValue.length > 0 && Object.keys(signatures).length > 0) {
          if (Object.keys(signatures).length < 1) return;
          const blob = await pdf(<PDFDocument formData={updatedFormValue} signatures={signatures} />).toBlob();
          const url = URL.createObjectURL(blob);

          if (iframeRef.current) {
            iframeRef.current.src = url;
          }
        }
      } else {
        alert('Failed to generate PDF');
      }
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  }

  const saveSignature = (ref: React.RefObject<SignatureCanvas>, key: string) => {
    alert('Ideally, this would save the signature to the backend');
    if (ref.current) {
      const signature = ref.current.getTrimmedCanvas().toDataURL("image/png");
      setSignatures((prev) => ({ ...prev, [key]: signature }));
    }
  };

  const clearSignature = (ref: React.RefObject<SignatureCanvas>) => {
    if (ref.current) {
      ref.current.clear();
    }
  };

  return (
    <div className="min-h-screen p-10">
      <h1 className="text-3xl font-bold mb-4 text-center">ARLO PDF Generator Dynamic Form - {user?.name}</h1>
      <div className="space-y-6 max-w-4xl mx-auto p-4 bg-white rounded-lg">
        {pdfFormData && pdfFormData.map((block: IFormBlock) => (
          <div key={block.id} className="p-6 border rounded-lg shadow-md bg-blue-50">
            <h2 className="text-2xl font-semibold mb-4">{block.header}</h2>
            {/* <div className="mb-4 flex justify-between">
              <button type="button" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={handleSelectAll}>Select All</button>
              <button type="button" className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600" onClick={handleDeselectAll}>Deselect All</button>
            </div> */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {block.sections.map((section: ISection) => (
                <div key={section.id} className="space-y-4">
                  {section.subHeader && <h4 className="text-xl font-semibold">{section.subHeader}</h4>}
                  {section.text && <p className="text-gray-700">{section.text}</p>}
                  {section.type === 'text' && (
                    <>
                      <label className="text-lg font-light">{section.label}
                        <input
                          type="text"
                          className="w-full p-2 border rounded"
                          value={formValue[section.id] as string || ''}
                          onChange={(e) =>
                            handleInputChange(section.id, e.target.value)
                          }
                        />
                      </label>
                    </>
                  )}
                  {section.questions?.map((question: IQuestion) => (
                    <div key={question.id} className="space-y-2">
                      <InputText question={question} formValue={formValue} handleInputChange={handleInputChange} />
                      {question.type === 'radio' && (
                        <RadioGroup question={question} formValue={formValue} handleInputChange={handleInputChange} />
                      )}
                    </div>
                  ))}
                  {section.signatureDisclosure && section.signatureDisclosure.map((signature) => (
                    <h3 key={signature} className="text-lg font-light">{signature}</h3>
                  ))}
                  {section.signatureBoldSubtext && <h3 className="text-lg font-bold">{section.signatureBoldSubtext}</h3>}
                  {section.blocks && section.blocks.map((block) => (
                    <div key={block.type} className="space-y-4">
                      {block.fields.map((field) => (
                        <div key={field.id} className="space-y-2">
                          <label className="inline-block font-medium">{field.label}
                            {field.type === 'signature' ? <>
                              <SignatureCanvas
                                ref={field.id === "contractHolderSignature" ? contractHolderSigRef : agencySigRef}
                                canvasProps={{ width: 400, height: 150, className: "sigCanvas" }}
                              />
                              <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-200 text-center" onClick={() => saveSignature(field.id === "contractHolderSignature" ? contractHolderSigRef : agencySigRef, field.id)}>
                                Save
                              </button>
                              <button className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-200 ml-5 text-center" onClick={() => clearSignature(field.id === "contractHolderSignature" ? contractHolderSigRef : agencySigRef)}>Clear</button> </> :
                              <input
                                type="text"
                                name={field.id}
                                className="w-full p-2 border rounded"
                                placeholder={field.placeholder}
                                value={formValue[field.id] as string || ''}
                                onChange={(e) => handleInputChange(field.id, e.target.value)}
                              />}
                          </label>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
              <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Generate PDF</button>
            </form>
          </div>
        ))}
        {/* Display the PDF in an iframe */}
        {pdfUrl && Object.keys(signatures).length === 2 && (
          <iframe
            ref={iframeRef}
            width="100%"
            height="600px"
            title="Generated PDF"
            className="border mt-4"
          />
        )}
      </div>
    </div>
  )
}

export default App
