// pdfCompressionWorker.js
// Place this file in your public folder

import { PDFDocument } from 'https://cdn.skypack.dev/pdf-lib@1.17.1';

// Fast PDF compression function for Web Worker
const compressPdf = async (inputBytes) => {
  try {
    const pdfDoc = await PDFDocument.load(inputBytes);
    const newPdfDoc = await PDFDocument.create();
    
    // Copy all pages to new document
    const pages = await newPdfDoc.copyPages(pdfDoc, pdfDoc.getPageIndices());
    pages.forEach((page) => {
      newPdfDoc.addPage(page);
    });
    
    // Save compressed PDF (strips metadata and rebuilds pages)
    return await newPdfDoc.save();
  } catch (error) {
    console.error('PDF compression error:', error);
    // If compression fails, return original bytes
    return inputBytes;
  }
};

// Listen for messages from main thread
self.onmessage = async function(e) {
  const { fileId, fileName, fileBuffer, type } = e.data;
  
  if (type === 'COMPRESS_PDF') {
    try {
      // Send progress update
      self.postMessage({
        type: 'COMPRESSION_PROGRESS',
        fileId,
        fileName,
        progress: 0,
        status: 'starting'
      });
      
      const originalSize = fileBuffer.byteLength;
      console.log(`Worker: Compressing ${fileName} - Original size: ${(originalSize / (1024 * 1024)).toFixed(2)} MB`);
      
      // Compress the PDF
      self.postMessage({
        type: 'COMPRESSION_PROGRESS',
        fileId,
        fileName,
        progress: 50,
        status: 'compressing'
      });
      
      const compressedBytes = await compressPdf(fileBuffer);
      const compressedSize = compressedBytes.byteLength;
      const compressionRatio = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);
      
      console.log(`Worker: Compressed ${fileName} - New size: ${(compressedSize / (1024 * 1024)).toFixed(2)} MB`);
      console.log(`Worker: Compression ratio: ${compressionRatio}% reduction`);
      
      // Send compressed result back to main thread
      self.postMessage({
        type: 'COMPRESSION_COMPLETE',
        fileId,
        fileName,
        compressedBytes,
        originalSize,
        compressedSize,
        compressionRatio,
        status: 'completed'
      });
      
    } catch (error) {
      console.error('Worker compression error:', error);
      
      // Send error back to main thread with original buffer
      self.postMessage({
        type: 'COMPRESSION_ERROR',
        fileId,
        fileName,
        originalBytes: fileBuffer,
        error: error.message,
        status: 'error'
      });
    }
  }
};