#%%
import plotly.express as px
import pandas as pd
#%%
df = pd.read_csv("disaster_fill_date.csv")
df = df.drop(['Dis Mag Value', 'Dis Mag Scale', 'Region', 'Location',
                'CPI', 'Latitude', 'Longitude', "Unnamed: 0"], axis = 1)

df_a = df.dropna(subset = ['Total Affected']).drop(['Total Deaths', 
                                                    "Total Damages ('000 US$)"], axis = 1)
df_a["Year"] = df_a['Date'].str[:4].astype("int64")
df_an = df_a.copy()

df_an = df_a.groupby(['Year', 'ISO', "Disaster Type"])['Total Affected'].sum()

df_an = df_an.to_frame()
df_an[['Value']] = df_an[['Total Affected']] * 1000
df_an['Year'] = 0
df_an['ISO'] = ''
df_an["Disaster Type"] = ""

for i in range(len(df_an.index.values)):
    df_an['Year'].iloc[i] = df_an.index.values[i][0]
    df_an['ISO'].iloc[i] = df_an.index.values[i][1]
    df_an["Disaster Type"].iloc[i] = df_an.index.values[i][2]
# %%
# fig = px.choropleth(df_an, locations="ISO",
#                     color="Disaster Type",
#                     hover_name="ISO", # column to add to hover information
#                     hover_data=['Total Affected', 'Year', 'ISO', 'Disaster Type'],
#                     animation_frame="Year",
#                     color_continuous_scale=px.colors.sequential.Plasma)
# fig.show()
def get_fig():
    fig = px.choropleth(df_an, locations="ISO",
                        color="Disaster Type",
                        hover_name="ISO", # column to add to hover information
                        hover_data=['Total Affected', 'Year', 'ISO', 'Disaster Type'],
                        animation_frame="Year",
                        color_continuous_scale=px.colors.sequential.Plasma)
    
    fig.update_layout(title = 'Time Slide on Total Affected People')

    return fig
#%%
import dash
import dash_html_components as html
import dash_core_components as dcc

app = dash.Dash()   #initialising dash app

app.layout = html.Div(id = 'parent', children = [
    html.H1(id = 'H1', children = 'Distribution and Severity of Disasters', style = {'textAlign':'center',\
                                            'marginTop':40,'marginBottom':40}),

        
        dcc.Graph(id = 'Heat Map', figure = get_fig())    
    ]
                     )

if __name__ == '__main__': 
    app.run_server()
#%%
import plotly.express as px
import pandas as pd
#%%
df = pd.read_csv("disaster_fill_date.csv")
df = df.drop(['Dis Mag Value', 'Dis Mag Scale', 'Region', 'Location',
                'CPI', 'Latitude', 'Longitude', "Unnamed: 0"], axis = 1)

df_a = df.dropna(subset = ['Total Affected']).drop(['Total Deaths', 
                                                    "Total Damages ('000 US$)"], axis = 1)
df_a["Year"] = df_a['Date'].str[:4].astype("int64")
df_an = df_a.copy()

df_an = df_a.groupby(['Year', 'ISO', "Disaster Type"])['Total Affected'].sum()

df_an = df_an.to_frame()
df_an[['Value']] = df_an[['Total Affected']] * 1000
df_an['Year'] = 0
df_an['ISO'] = ''
df_an["Disaster Type"] = ""

for i in range(len(df_an.index.values)):
    df_an['Year'].iloc[i] = df_an.index.values[i][0]
    df_an['ISO'].iloc[i] = df_an.index.values[i][1]
    df_an["Disaster Type"].iloc[i] = df_an.index.values[i][2]


fig = px.choropleth(df_an, locations="ISO",
                    color="Disaster Type",
                    hover_name="ISO", # column to add to hover information
                    hover_data=['Total Affected', 'Year', 'ISO', 'Disaster Type'],
                    animation_frame="Year",
                    color_continuous_scale=px.colors.sequential.Plasma)

fig.update_layout(title = 'Time Slide on Total Affected People')
fig.write_html("map.html")
# %%