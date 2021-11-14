import pandas as pd
from pyvis import network as net
from IPython.core.display import display, HTML

G=net.Network(height='100%', width='100%', heading='')
G.show_buttons(filter_=["physics"])
#g.toggle_physics(True)

edges = pd.read_csv('meta/edges.csv')
nodes = pd.read_csv('meta/nodes.csv')

for i, row in nodes.iterrows():
    type = row['Type']
    if type == 0:
        G.add_node(i, label=row['Id'], color='red')
    if type == 1:
        G.add_node(i, label=row['Id'], color='blue')

for i, row in edges.iterrows():
    G.add_edge(int(row['From']), int(row['To']))

G.show('meta/Graph.html')
display(HTML('meta/Graph.html'))