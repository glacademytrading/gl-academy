import cv2, numpy as np
from PIL import Image, ImageDraw, ImageFilter
S=2
src=Image.open('geometria-base.jpg').convert('RGB'); W,H=src.size
chart=Image.open('operacional.png').convert('RGB'); cw,ch=chart.size
a=np.asarray(src).astype(np.float32)
# 1) remove text: fill with real starry sky from the plain bottom band, feathered
tx0,ty0,tx1,ty1=84,866,608,1040
sky=a[1034:1144,tx0:tx1]
sky=np.concatenate([sky,sky[::-1]],0)[:ty1-ty0]
detail=sky-cv2.GaussianBlur(sky,(0,0),6)
# smooth background tone: per-row blend between the dark sky left and right of the text box
L=cv2.GaussianBlur(a[:,tx0-16:tx0].mean(1,keepdims=True),(0,0),12)
R=cv2.GaussianBlur(a[:,tx1:tx1+16].mean(1,keepdims=True),(0,0),12)
t=np.linspace(0,1,W,dtype=np.float32)[None,:,None]
low=L[:,:,None].reshape(H,1,3)*(1-t)+R.reshape(H,1,3)*t
patch=low[ty0:ty1,tx0:tx1]+detail
m=np.zeros((H,W),np.float32); m[ty0+6:ty1-6,tx0+6:tx1-6]=1
m=cv2.GaussianBlur(m,(0,0),8)
m[872:1026,112:580]=1  # text bounding box always fully replaced
full=a.copy(); full[ty0:ty1,tx0:tx1]=patch
a=a*(1-m[...,None])+full*m[...,None]
bg=Image.fromarray(np.clip(a,0,255).astype(np.uint8)).resize((W*S,H*S),Image.LANCZOS).convert('RGBA')
# 2) panel over the medallion (same black as the chart background), chart centred inside
px0,py0,px1,py1=92*S,305*S,600*S,801*S
cx,cy=(px0+px1)//2,(py0+py1)//2
x0,y0=cx-cw//2,cy-ch//2
glow=Image.new('RGBA',bg.size,(0,0,0,0)); g=ImageDraw.Draw(glow)
g.rectangle((px0-6,py0-6,px1+6,py1+6),fill=(255,190,90,150))
bg=Image.alpha_composite(bg,glow.filter(ImageFilter.GaussianBlur(26)))
d=ImageDraw.Draw(bg)
d.rectangle((px0,py0,px1,py1),fill=(4,4,4,255),outline=(212,170,95,255),width=3)
d.rectangle((px0+6,py0+6,px1-6,py1-6),outline=(120,90,45,255),width=1)
nodes=Image.new('RGBA',bg.size,(0,0,0,0)); n=ImageDraw.Draw(nodes)
C=[(px0,py0),(px1,py0),(px0,py1),(px1,py1)]
for x,y in C: n.ellipse((x-16,y-16,x+16,y+16),fill=(255,200,110,210))
bg=Image.alpha_composite(bg,nodes.filter(ImageFilter.GaussianBlur(9))); d=ImageDraw.Draw(bg)
for x,y in C: d.ellipse((x-5,y-5,x+5,y+5),fill=(255,238,195,255))
out=bg.convert('RGB'); out.paste(chart,(x0,y0))
out.save('operacional-geometria-gl.png',optimize=True)
print('chart identical:',np.array_equal(np.asarray(out)[y0:y0+ch,x0:x0+cw],np.asarray(chart)),out.size,(x0,y0))
out.resize((W,H),Image.LANCZOS).save('preview.jpg',quality=90)
