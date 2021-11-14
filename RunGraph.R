library(igraph)

ds <- read.csv(file = "projects/nft-guru/framework/out.csv")

links=data.frame(
  source=ds["From"],
  target=ds["To"]
)

# Turn it into igraph object
network <- graph_from_data_frame(d=links, directed=T) 

# Count the number of degree for each node:
deg <- degree(network, mode="all")

# Plot
plot(network, vertex.size=deg*6, vertex.color=rgb(0.1,0.7,0.8,0.5) )
