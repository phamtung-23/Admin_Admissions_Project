# import pdfkit

# #Define path to wkhtmltopdf.exe
# path_to_wkhtmltopdf = r'C:\Program Files\wkhtmltopdf\bin\wkhtmltopdf.exe'

# #Define url
# url = 'https://admission.tdtu.edu.vn/dai-hoc/tuyen-sinh/phuong-thuc-2023'

# #Point pdfkit configuration to wkhtmltopdf.exe
# config = pdfkit.configuration(wkhtmltopdf=path_to_wkhtmltopdf)

# #Convert Webpage to PDF
# pdfkit.from_url(url, output_path='tdt.pdf', configuration=config)

# ##########################################
import pdfkit
import sys
import os

# Define path to wkhtmltopdf executable 
# wkhtmltopdf_path = r'C:\Program Files\wkhtmltopdf\bin\wkhtmltopdf.exe'
wkhtmltopdf_path = r'convertHtmlToPdf\wkhtmltopdf.exe'

# Get URL and output file name from user
url = sys.argv[1]
output_directory = 'outputPDF'  # Output directory
if not os.path.exists(output_directory):
  os.makedirs(output_directory)  # Create the output directory if it doesn't exist
output_file = os.path.join(output_directory, sys.argv[2] + ".pdf")
# Configure pdfkit to use wkhtmltopdf executable
config = pdfkit.configuration(wkhtmltopdf=wkhtmltopdf_path) 

# Convert URL to PDF
pdfkit.from_url(url, output_path=output_file, configuration=config)

print(output_file)
