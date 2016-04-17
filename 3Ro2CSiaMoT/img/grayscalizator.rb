`ls *.png`.split("\n").each{|q|
    `convert -type Grayscale #{q} #{q.split(".")[0]}grsc.png`;
    `mv #{q.split(".")[0]}grsc.png #{q}`
}
