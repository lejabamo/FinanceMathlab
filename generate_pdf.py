import os
import re
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, KeepTogether
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY

def clean_html(text):
    # Remove HTML comments
    text = re.sub(r'<!--.*?-->', '', text)
    # Remove div alignment tags
    text = re.sub(r'</?div[^>]*>', '', text)
    # Remove raw <br> tags completely
    text = re.sub(r'<br\s*/?>', '', text)
    # Remove double spaces
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def parse_markdown_to_story(md_path, styles):
    story = []
    
    with open(md_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Split content by lines
    lines = content.split('\n')
    
    in_center = False
    in_list = False
    list_items = []
    
    for line in lines:
        stripped = line.strip()
        
        # Check center alignment trigger
        if '<div align="center">' in stripped:
            in_center = True
            continue
        if '</div>' in stripped:
            in_center = False
            continue
            
        # Handle Page Breaks / Section dividers
        if stripped == '---':
            if in_list:
                story.append(build_list(list_items, styles))
                in_list = False
                list_items = []
            story.append(PageBreak())
            continue
            
        # Handle Headings
        if stripped.startswith('# '):
            if in_list:
                story.append(build_list(list_items, styles))
                in_list = False
                list_items = []
            title_text = clean_html(stripped[2:])
            story.append(Spacer(1, 15))
            story.append(Paragraph(title_text, styles['CustomTitle']))
            story.append(Spacer(1, 15))
            continue
            
        if stripped.startswith('## '):
            if in_list:
                story.append(build_list(list_items, styles))
                in_list = False
                list_items = []
            h2_text = clean_html(stripped[3:])
            story.append(Spacer(1, 12))
            story.append(Paragraph(h2_text, styles['CustomH1']))
            story.append(Spacer(1, 8))
            continue
            
        if stripped.startswith('### '):
            if in_list:
                story.append(build_list(list_items, styles))
                in_list = False
                list_items = []
            h3_text = clean_html(stripped[4:])
            story.append(Spacer(1, 10))
            story.append(Paragraph(h3_text, styles['CustomH2']))
            story.append(Spacer(1, 6))
            continue
            
        # Handle Bullet points
        if stripped.startswith('* ') or stripped.startswith('- '):
            if not in_list:
                in_list = True
                list_items = []
            item_text = clean_html(stripped[2:])
            # Clean basic markdown bolding
            item_text = re.sub(r'\*\*(.*?)\*\*', r'<b>\1</b>', item_text)
            item_text = re.sub(r'\*(.*?)\*', r'<i>\1</i>', item_text)
            list_items.append(item_text)
            continue
            
        # Handle Numbered Lists
        if re.match(r'^\d+\.\s', stripped):
            if not in_list:
                in_list = True
                list_items = []
            item_text = re.sub(r'^\d+\.\s', '', stripped)
            item_text = clean_html(item_text)
            item_text = re.sub(r'\*\*(.*?)\*\*', r'<b>\1</b>', item_text)
            item_text = re.sub(r'\*(.*?)\*', r'<i>\1</i>', item_text)
            list_items.append(item_text)
            continue
            
        # Empty line ends the list
        if stripped == '':
            if in_list:
                story.append(build_list(list_items, styles))
                in_list = False
                list_items = []
            continue
            
        # Handle regular paragraphs
        text = clean_html(stripped)
        if text:
            # Convert **bold** to <b>bold</b>
            text = re.sub(r'\*\*(.*?)\*\*', r'<b>\1</b>', text)
            # Convert *italic* to <i>italic</i>
            text = re.sub(r'\*(.*?)\*', r'<i>\1</i>', text)
            # Remove inline math $ or $$
            text = text.replace('$$', '').replace('$', '')
            
            if in_center:
                story.append(Paragraph(text, styles['CenteredInfo']))
                story.append(Spacer(1, 4))
            else:
                story.append(Paragraph(text, styles['CustomBody']))
                story.append(Spacer(1, 6))
            
    # Append any remaining list
    if in_list:
        story.append(build_list(list_items, styles))
        
    return story

def build_list(items, styles):
    list_story = []
    for item in items:
        p_text = f"• {item}"
        list_story.append(Paragraph(p_text, styles['CustomList']))
        list_story.append(Spacer(1, 3))
    return KeepTogether(list_story)

def main():
    pdf_path = "Informe_FinanceMath_Lab.pdf"
    md_path = "Informe_FinanceMath_Lab.md"
    
    # Setup document
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=letter,
        rightMargin=54, leftMargin=54,
        topMargin=54, bottomMargin=54
    )
    
    # Styles
    styles = getSampleStyleSheet()
    
    # Custom styles
    custom_styles = {
        'CustomTitle': ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontName='Helvetica-Bold',
            fontSize=22,
            leading=26,
            textColor=colors.HexColor('#1e293b'), # Slate Navy
            alignment=TA_CENTER,
            spaceAfter=15
        ),
        'CustomH1': ParagraphStyle(
            'CustomH1',
            parent=styles['Heading2'],
            fontName='Helvetica-Bold',
            fontSize=14,
            leading=18,
            textColor=colors.HexColor('#0f766e'), # Deep Teal
            spaceBefore=12,
            spaceAfter=8
        ),
        'CustomH2': ParagraphStyle(
            'CustomH2',
            parent=styles['Heading3'],
            fontName='Helvetica-Bold',
            fontSize=11,
            leading=14,
            textColor=colors.HexColor('#334155'),
            spaceBefore=8,
            spaceAfter=4
        ),
        'CustomBody': ParagraphStyle(
            'CustomBody',
            parent=styles['BodyText'],
            fontName='Helvetica',
            fontSize=9.5,
            leading=13.5,
            textColor=colors.HexColor('#334155'),
            alignment=TA_JUSTIFY,
            spaceAfter=6
        ),
        'CustomList': ParagraphStyle(
            'CustomList',
            parent=styles['BodyText'],
            fontName='Helvetica',
            fontSize=9.5,
            leading=13.5,
            textColor=colors.HexColor('#334155'),
            leftIndent=15,
            spaceAfter=3
        ),
        'CenteredInfo': ParagraphStyle(
            'CenteredInfo',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=10,
            leading=14,
            textColor=colors.HexColor('#475569'),
            alignment=TA_CENTER
        )
    }
    
    story = parse_markdown_to_story(md_path, custom_styles)
    
    # Build PDF
    doc.build(story)
    print("PDF generated successfully.")

if __name__ == "__main__":
    main()
