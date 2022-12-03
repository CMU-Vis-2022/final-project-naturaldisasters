# %%
import plotly_express as px
import pandas as pd
import plotly.graph_objects as go

df = pd.read_csv("d.csv")

def get_df():
    df = pd.read_csv('d.csv')
    return df

def get_plot(disaster):
    df = get_df()
    if disaster == 'Earthquake':
        iso = ['China', 'Japan', 'India']

    if disaster == 'Storm':
        iso = ['China', 'Philippines', 'India']

    if disaster == 'Flood':
        iso = ['China', 'United States', 'India']

    df = df[(df['Country'] == iso[0]) | (df['Country'] == iso[1]) | (df['Country'] == iso[2])]

    x = df[df['Disaster Type'] == disaster]['Latitude'].drop_duplicates() 
    y = df[df['Disaster Type'] == disaster]['Longitude'].drop_duplicates() 
    z = df[df['Disaster Type'] == disaster]['Value']

    if disaster == 'Earthquake':
        z = z * 10

    if disaster == 'Storm':
        z = z / 5

    if disaster == 'Flood':
        z = z / 10000

    fig = px.scatter(
        df,
        x = x,
        y = y,
        size =  z,
        hover_name = z,
        labels = dict(x = " ", y = " ")
        )

    fig.update_yaxes(ticks="inside", title='Longitude', range = [-180, 180])
    fig.update_xaxes(ticks="inside", title='Latitude', range = [-90, 90])
    fig.show()

d = ['Earthquake','Storm','Flood']
fig = go.Figure()
for disaster in d:

    if disaster == 'Earthquake':
        iso = ['China', 'Japan', 'India']

    if disaster == 'Storm':
        iso = ['China', 'Philippines', 'India']

    if disaster == 'Flood':
        iso = ['China', 'United States', 'India']

    df = df[(df['Country'] == iso[0]) | (df['Country'] == iso[1]) | (df['Country'] == iso[2])]

    x = df[df['Disaster Type'] == disaster]['Latitude'].drop_duplicates() 
    y = df[df['Disaster Type'] == disaster]['Longitude'].drop_duplicates() 
    z = df[df['Disaster Type'] == disaster]['Value']

    if disaster == 'Earthquake':
        z = z * 5

    if disaster == 'Storm':
        z = z / 10

    if disaster == 'Flood':
        z = z / 50000
    
    fig.add_trace(go.Scatter(x=x,
                            y=y,
                            mode='markers',
                            marker=dict(size=z,
                                    color=[0, 1, 2, 3,4,5,6,7]
                                    ),
                            name=disaster
    ))
    fig.update_yaxes(ticks="inside", title=None, range=[-180,180])
    fig.update_xaxes(ticks="inside", title=None, range=[-90,90])
    
    
fig.update_layout(
    updatemenus=[go.layout.Updatemenu(
        active=0,
        buttons=list(
            [
            dict(label = 'All',
            method = 'update',
            args = [{'visible': [True, True, True]}, # the index of True aligns with the indices of plot traces
                    {'title': 'All',
                        'showlegend':True}]),
            dict(label = 'Earthquake',
                method = 'update',
                args = [{'visible': [True, False, False]}, # the index of True aligns with the indices of plot traces
                        {'title': 'Earthquake',
                        'showlegend':True}]),
            dict(label = 'Storm',
                method = 'update',
                args = [{'visible': [False, True, False]},
                        {'title': 'Storm',
                        'showlegend':True}]),
            dict(label = 'Flood',
                method = 'update',
                args = [{'visible': [False, False, True]},
                        {'title': 'Flood',
                        'showlegend':True}]),
        ])
            )
    ])
fig.show()