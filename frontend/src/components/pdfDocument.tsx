
import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { IPDFDocumentProps } from "../types/formData.types";

  const styles = StyleSheet.create({
    page: { padding: 30, fontSize: 12 },
    header: { fontSize: 18, textAlign: "left", marginBottom: 20, fontWeight: "bold" },
    section: { marginBottom: 15 },
    subHeader: { fontSize: 14, marginBottom: 5, fontWeight: "bold" },
    text: { marginBottom: 10 },
    signatureText: { marginBottom: 5, fontWeight: "bold" },
    table: { display: "flex", width: "auto", marginBottom: 15 },
    tableRow: { flexDirection: "row" },
    tableCellQuestion: { border: 0.5, padding: 5, flex: 8, textAlign: "left" }, // Wider column for questions
    tableCellOption: { border: 0.5, padding: 5, flex: 0.4, textAlign: "center", color: 'black' }, // Narrower columns for Yes/No
    boldText: { fontWeight: "bold" },
    signature: { width: 150, height: 50, marginTop: 10 },
  });


const PDFDocument: React.FC<{ formData: IPDFDocumentProps[], signatures: {[key: string]: string} }> = ({ formData, signatures }) => {
    return <Document>
    <Page size="A4" style={styles.page}>
        {/* Render the header */}
        <Text style={styles.header}>{formData[0].header}</Text>

        {/* Render sections */}
        {formData[0].sections.map((section) => (
            <View key={section.id} style={styles.section}>
                <Text style={styles.subHeader}>{section.subHeader}</Text>
                {section.text && <Text style={styles.text}>{section.text}</Text>}

                {/* Render questions as a table */}
                {section.questions && (
                    <View style={styles.table}>
                        <View style={styles.tableRow}>
                            <Text style={[styles.tableCellQuestion, { fontWeight: "bold" }]}>Question</Text>
                            <Text style={[styles.tableCellOption, { fontWeight: "bold" }]}>Yes</Text>
                            <Text style={[styles.tableCellOption, { fontWeight: "bold" }]}>No</Text>
                        </View>
                        {section.questions.map((question) => (
                            <View key={question.id} style={styles.tableRow}>
                                <Text style={styles.tableCellQuestion}>{question.label}</Text>
                                <Text style={styles.tableCellOption}>{question.value === "yes" ? "Yes" : ""}</Text>
                                <Text style={styles.tableCellOption}>{question.value === "no" ? "No" : ""}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* Render text fields */}
                {section.label && (
                    <Text style={styles.text}>
                        {section.label}: {section.value || "N/A"}
                    </Text>
                )}

                {/* Render signature disclosures */}
                {section.signatureDisclosure &&
                    section.signatureDisclosure.map((disclosure, idx) => (
                        <Text key={idx} style={styles.text}>
                            {disclosure}
                        </Text>
                    ))}

                {/* Render bold signature subtext */}
                {section.signatureBoldSubtext && (
                    <Text style={[styles.text, styles.boldText]}>{section.signatureBoldSubtext}</Text>
                )}

                {/* Render eSignatureBlock */}
                {section.id === "eSignatureBlock" &&
                    section.blocks?.map((block, blockIndex) => (
                        <View key={blockIndex} style={styles.section}>
                            <Text style={styles.subHeader}>{block.type === "contractHolder" ? "Contract Holder" : "Agency"}</Text>
                            {block.fields.map((field, fieldIndex) => (
                                
                                <React.Fragment key={fieldIndex}>
                                    {field.type === 'signature' && signatures[field.id] ? (
                                        field.id === 'contractHolderSignature' ? (
                                            <Image style={styles.signature} src={signatures.contractHolderSignature} />
                                        ) : (
                                            <Image style={styles.signature} src={signatures.agencySignature} />
                                        )
                                    ) : (
                                        <Text style={styles.signatureText}>
                                            {field.placeholder || ""}
                                        </Text>
                                    )}
                                    <Text style={styles.signatureText}>
                                        {field.label}: {field.value || ""}
                                    </Text>
                                </React.Fragment>
                            ))}
                        </View>
                    ))}
            </View>
        ))}
    </Page>
</Document>
}


export default PDFDocument;
