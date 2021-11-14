import networkx as nx
import matplotlib.pyplot as plt

G=nx.DiGraph()

item = [1,2]

G.add_edge(*item) #color = item[-1], weight = 2)

pos = nx.circular_layout(G)    
nx.draw(G, pos, with_labels = True, edge_color = 'b')   
plt.show()