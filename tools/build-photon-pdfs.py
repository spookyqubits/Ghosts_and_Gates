"""Rebuild Photon classroom PDFs and HTML guide; requires reportlab.

Usage: python tools/build-photon-pdfs.py /path/to/CatchThePhoton
The browser-printable deck uses the live game's exact SVG artwork; this PDF
renderer uses the same coordinates and phase/amplitude conventions.
"""
from pathlib import Path
import math, sys
from html import escape
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor, Color
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
from reportlab.lib.styles import ParagraphStyle

out = Path(sys.argv[1]); out.mkdir(parents=True, exist_ok=True)
fonts=Path('/System/Library/Fonts/Supplemental')
for name,file in [('Body','Arial.ttf'),('Sketch','Comic Sans MS.ttf'),('SketchBold','Comic Sans MS Bold.ttf')]:
    pdfmetrics.registerFont(TTFont(name,str(fonts/file)))
waves={'U':('up',0,1,'#154c9c','#e4edf9','↑'),'D':('down',0,-1,'#c0182a','#fbe5e8','↓'),'R':('right',1,0,'#6c2f9e','#f0e6f8','→'),'L':('left',-1,0,'#8c6000','#f6edcf','←')}
ink=HexColor('#242622')
def card(c, direction, strength):
    name,x,y,color,tint,sym=waves[direction]
    def text(x,y,s,size=11,font='Sketch',align='center',color=ink):
        c.setFillColor(color);c.setFont(font,size)
        getattr(c,{'center':'drawCentredString','left':'drawString','right':'drawRightString'}[align])(x,300-y,s)
    def line(x1,y1,x2,y2,color='#90918c',width=.8):
        c.setStrokeColor(HexColor(color));c.setLineWidth(width);c.line(x1,300-y1,x2,300-y2)
    def polygon(points):
        p=c.beginPath();p.moveTo(points[0][0],300-points[0][1])
        for px,py in points[1:]:p.lineTo(px,300-py)
        p.close();c.setFillColor(HexColor(color));c.drawPath(p,stroke=0,fill=1)
    c.setStrokeColor(HexColor(color));c.setFillColor(HexColor('#faf7f1'));c.setLineWidth(2);c.roundRect(2,2,196,296,18,fill=1,stroke=1)
    p=c.beginPath();p.moveTo(23,269);p.curveTo(75,281,125,281,177,269)
    c.setStrokeColor(HexColor(tint));c.setLineWidth(18);c.setLineCap(1);c.drawPath(p)
    title='CATCH THE PHOTON'; widths=[pdfmetrics.stringWidth(ch,'SketchBold',11) for ch in title]; cursor=100-sum(widths)/2
    for ch,w in zip(title,widths):
        px=cursor+w/2; py=31-7*(1-((px-100)/82)**2)
        c.saveState();c.translate(px,300-py);c.rotate(-math.degrees(math.atan(14*(px-100)/82**2)));c.setFont('SketchBold',11);c.setFillColor(HexColor(color));c.drawCentredString(0,0,ch);c.restoreState();cursor+=w
    for sx,sy in [(15,26),(185,19)]:
        p=c.beginPath();points=[(sx,sy-6),(sx+2,sy-2),(sx+6,sy),(sx+2,sy+2),(sx,sy+6),(sx-2,sy+2),(sx-6,sy),(sx-2,sy-2)]
        p.moveTo(points[0][0],300-points[0][1])
        for px,py in points[1:]:p.lineTo(px,300-py)
        p.close();c.setStrokeColor(HexColor(color));c.setLineWidth(1.3);c.drawPath(p)
    text(100,104,str(strength),77,'SketchBold')
    arrows={'U':[(100,113),(120,136),(109,136),(109,160),(91,160),(91,136),(80,136)],'D':[(91,114),(109,114),(109,138),(120,138),(100,161),(80,138),(91,138)],'R':[(77,128),(102,128),(102,117),(126,137),(102,157),(102,146),(77,146)],'L':[(123,128),(98,128),(98,117),(74,137),(98,157),(98,146),(123,146)]}
    polygon(arrows[direction]);text(100,182,f'Move {strength} {name}',15,'SketchBold')
    line(38,208,38,260);line(35,214,38,214);line(35,234,177,234);line(35,254,38,254)
    for yy,label in [(217,'+2'),(237,'0'),(257,'−2')]:text(32,yy,label,9,align='right')
    p=c.beginPath()
    for i in range(65):
        t=i/64; px=38+132*t;py=234-10*strength*(y*math.cos(2*math.pi*t)+x*math.sin(2*math.pi*t))
        (p.moveTo if i==0 else p.lineTo)(px,300-py)
    c.setStrokeColor(HexColor(color));c.setLineWidth(2);c.drawPath(p)
    sy=234-10*y*strength;c.setFillColor(HexColor(color));c.circle(38,300-sy,2.5,stroke=0,fill=1)
    text(40,sy+(10 if y<0 else -6),'START',8,'SketchBold','left',HexColor(color));text(178,265,'Time →',8,font='Body',align='right')
    text(100,277,'In step: add.',11);text(100,290,'Opposite phase: subtract.',10)

cards=[(d,1 if i<7 else 2) for i in range(10) for d in waves]
c=canvas.Canvas(str(out/'CatchThePhoton_Wave_Cards.pdf'),pagesize=(612,792));c.setTitle('Catch the Photon wave cards')
for start in range(0,40,6):
    c.setFillColor(ink);c.setFont('Body',13);c.drawString(45,752,'Catch the Photon wave cards')
    c.setFont('Body',9);c.drawString(45,734,'Print all 7 sheets at 100%. Cut borders. Use identical opaque backs or sleeves.')
    for j,(direction,strength) in enumerate(cards[start:start+6]):
        c.saveState();c.translate(48+(j%3)*177,432-(j//3)*267);c.scale(.81,.81);card(c,direction,strength);c.restoreState()
    c.setFillColor(ink);c.setFont('Body',9);c.drawString(48,116,'40 cards: seven strength-1 and three strength-2 cards in each direction.')
    c.drawString(48,101,f'Sheet {start//6+1} of 7 · Blue ↑  Red ↓  Purple →  Gold ←');c.showPage()
c.save()

sections=[
('Goal and materials','Make your detector bright and the other detector dark, then sample one photon. For two players, allow about 10 minutes. Use the 40 printed wave cards, the Wave Board, two tokens, and blue/purple chips or paper slips. The board can require up to 32 slips of each color. Use identical opaque card backs or sleeves.'),
('Read a card','The number is wave strength (amplitude): move that many squares in the arrow direction. Blue ↑ is up, red ↓ down, purple → right, gold ← left. Each direction has seven strength-1 and three strength-2 cards. All plots use the same scale and frequency. The arrow describes a board move, not a photon’s travel.'),
('Set up and play eight rounds','Put both detector tokens at START (brightness 0). Shuffle and deal three cards each. Each player secretly chooses one card and a target detector. Reveal both, resolve A’s card first and then B’s, and draw back to three cards. Apply the full 1- or 2-square move. Keep used cards in a discard pile; reshuffle them if the draw pile runs out.'),
('Edges and simultaneous moves','A player cannot choose a card that would leave the board on the selected detector. If the first revealed move makes the second move leave the board, the second card is lost. If no card is legal on either detector, discard one instead. A 2-square move cannot be shortened to fit.'),
('Catch the photon and replay','After eight rounds, read the brightness under each token. Put that many chips of each player’s color in a cup and draw one. A brighter detector is more likely to win, but can lose a trial. If both are dark, play another round. In the browser, Solo quick play starts the computer game with open hands and resolves rounds in fewer clicks. New game or Play again keeps that mode.'),
('An exact cancellation example','At one square above START, a ↓1 card returns the token to START and makes brightness 0. A ↓2 card instead crosses START and ends one square below it: brightness stays 1. A larger card is not always better.'),
('Science and probability','At position (x, y), the model’s wave is y cos(2πt/T) + x sin(2πt/T), with amplitude √(x² + y²). The board number x² + y² is brightness: an unnormalized probability weight. Divide each detector’s weight by their sum to obtain the detection probabilities. Weights 25 and 9 give chances 25/34 and 9/34. When both weights are zero, the game has no photon draw.'),
('Phase and strength','Up begins at a crest, down at a trough, right at zero rising, and left at zero falling. In-step amplitudes add. Opposite phases subtract; complete cancellation requires equal amplitudes. ↑2 + ↓1 leaves ↑1, while ↑2 + ↓2 gives zero. Equal-amplitude waves a quarter-cycle apart combine to an amplitude √2 times either wave. A strength-2 card from START gives brightness 4.'),
('Scope of the model','In an ideal fixed-input, lossless two-output optical setup, total detection probability is conserved, so increasing one output’s probability decreases the other’s. This game builds the two relative amplitudes independently and then normalizes their squared magnitudes. It does not simulate that apparatus. Real waves can have any phase; the cards use four.'),
('Facilitation and discussion','Start with one cancellation example, then let learners play. Ask: When is strength 1 better than strength 2? Why can adding a wave make a detector darker? Why can a good strategy lose one trial? Show the achieved chances alongside the sampled result. In Wave Lab, compare partial cancellation, complete cancellation, and a phase reversal. A simple challenge is to reach a dark detector using a strength-2 wave and smaller opposite waves.'),
('Credits','Developed using QCaMP material. The arrow addition model is related to the phasor method described in Feynman’s QED (1985). The wave board and card game are classroom teaching models.')]
styles={
 'title':ParagraphStyle('title',fontName='Body',fontSize=23,leading=28,spaceAfter=12),
 'sub':ParagraphStyle('sub',fontName='Body',fontSize=11,leading=15,spaceAfter=15),
 'head':ParagraphStyle('head',fontName='Body',fontSize=12,leading=16,spaceBefore=11,spaceAfter=5),
 'body':ParagraphStyle('body',fontName='Body',fontSize=10.2,leading=14.5,spaceAfter=6)}
story=[Paragraph('Catch the Photon',styles['title']),Paragraph('Facilitator guide for numbered wave cards',styles['sub'])]
for i,(heading,body) in enumerate(sections):
    if i==6:story.extend([PageBreak(),Paragraph('The science and discussion',styles['title'])])
    story.extend([Paragraph(heading,styles['head']),Paragraph(escape(body),styles['body'])])
SimpleDocTemplate(str(out/'CatchThePhoton_Facilitator_Guide.pdf'),pagesize=(612,792),leftMargin=48,rightMargin=48,topMargin=44,bottomMargin=44,title='Catch the Photon facilitator guide').build(story)
body=''.join(f'<h2>{escape(h)}</h2><p>{escape(p)}</p>' for h,p in sections)
(out/'CatchThePhoton_Facilitator_Guide.html').write_text('<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Catch the Photon facilitator guide</title><style>@page{size:letter;margin:.65in}body{font:16px/1.55 Arial,sans-serif;background:#faf7f1;color:#242622;margin:40px auto;padding:0 24px;max-width:800px}h1{color:#b41524}h2{font-size:19px;margin-bottom:5px}p{margin-top:0}@media print{body{background:white;margin:0}h1{color:black}}</style><h1>Catch the Photon</h1><p>Facilitator guide for numbered wave cards</p>'+body+'</html>')

c=canvas.Canvas(str(out/'catch_the_photon_board.pdf'),pagesize=(612,792));c.setTitle('Catch the Photon wave board');c.setFillColor(ink);c.setFont('Body',24);c.drawCentredString(306,744,'Catch the Photon')
c.setFont('Body',11);c.drawCentredString(306,722,'Move in the arrow direction by the card’s strength. Read brightness at the token.')
left,bottom,cell=81,200,50
for gy in range(-4,5):
    for gx in range(-4,5):
        xx=left+(gx+4)*cell;yy=bottom+(gy+4)*cell;b=gx*gx+gy*gy
        c.setFillColor(Color(1,1-.16*b/32,.96-.50*b/32));c.setStrokeColor(HexColor('#b9bdc8'));c.setLineWidth(.5);c.rect(xx,yy,cell,cell,fill=1,stroke=1)
        c.setStrokeColor(HexColor('#c9ccd5'));c.line(xx+5,yy+20,xx+45,yy+20)
        p=c.beginPath()
        for j in range(41):
            t=j/40;px=xx+5+40*t;py=yy+20+3.3*(gy*math.cos(2*math.pi*t)+gx*math.sin(2*math.pi*t));(p.moveTo if j==0 else p.lineTo)(px,py)
        c.setLineWidth(1);c.setStrokeColor(HexColor('#1f2a44'));c.drawPath(p)
        c.setFillColor(Color(1,1,1));c.rect(xx+2,yy+36,17,12,fill=1,stroke=0);c.setFillColor(ink);c.setFont('Body',8);c.drawString(xx+4,yy+39,str(b))
c.setStrokeColor(ink);c.setLineWidth(2);c.rect(left+4*cell,bottom+4*cell,cell,cell);c.setFont('Body',6);c.drawCentredString(306,bottom+4*cell+5,'START')
for x,y,t,color in [(306,666,'↑ up','#154c9c'),(306,180,'↓ down','#c0182a'),(59,420,'←','#8c6000'),(550,420,'→','#6c2f9e')]:c.setFillColor(HexColor(color));c.setFont('Body',16);c.drawCentredString(x,y,t)
c.setFillColor(ink);c.setFont('Body',11)
for i,line in enumerate(['Blue ↑ · Red ↓ · Purple → · Gold ←','Board brightness = x² + y². This is a probability weight.','Chance of A = brightness A / (brightness A + brightness B).','If both detectors are dark, play another round.','A strength-2 card moves two squares; it cannot be shortened.']):c.drawCentredString(306,143-i*19,line)
c.save()
print('Generated wave cards (7 pages), facilitator guide, HTML guide, and board in',out)
