#%%
import pandas as pd
import gradio as gr
import matplotlib.image as mpimg
import matplotlib.pyplot as plt
#%%
df = pd.read_csv("disaster_fill_date.csv")
df = df.dropna(subset = ['Total Affected'])
dis = df['Disaster Type'].unique().tolist()

#%%
def get_top(iso):
    # path = "C:\\Users\\Zheyi\\Documents\\CMU\\05619\\p\\Choose\\"
    df1 = df[df['ISO'] == iso]
    dic = {}
    for d in dis:
        s = sum(df1[df1['Disaster Type'] == d]['Total Affected'])
        dic[d] = s
        
    a = sorted(dic.items(), key=lambda x: x[1], reverse=True)
    top = []
    for i in range(3):
        # top.append(path + a[i][0] + ".png")
        top.append(a[i][0] + ".png")

    return top[0], top[1], top[2]

#%%
with gr.Blocks() as app:
    with gr.Column():
        text1 = gr.Textbox(lines=1, placeholder="ISO Here...", label='Choose ISO')
        btn1 = gr.Button("Check for Top 3").style(full_width=True)
    with gr.Row():
        image1 = gr.Image(label='Disaster').style(width=200, height=200)
        image2 = gr.Image(label='Disaster').style(width=200, height=200)
        image3 = gr.Image(label='Disaster').style(width=200, height=200)

    btn1.click(get_top, inputs=text1, outputs=[image1, image2, image3])

app.launch(share = True)
#%%
