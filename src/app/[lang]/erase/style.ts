const printStyles = `
  /* Initially hide the print area */
  #print-area {
    display: none; /* Completely hide the print area */
  }

  /* Show only the print area during printing */
  @media print {
    body * {
      visibility: hidden; /* Hide all elements */
    }
    #print-area {
      display: block; /* Show the print area */
      visibility: visible;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background: white; /* Ensure white background for printing */
      padding: 20px;
      box-sizing: border-box;
    }
    #print-area img {
      max-width: 100%; /* Scale image to fit page width */
      max-height: 100%; /* Scale image to fit page height */
      object-fit: contain; /* Maintain aspect ratio */
    }
  }
`

export default printStyles
