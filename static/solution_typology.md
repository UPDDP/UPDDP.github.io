Our VA solution typology consists of three core categories: A) Data Manipulation, B) Visualization, and C) Interaction. The B) Visualization category encompasses both composite and non-composite visualization techniques, while the C) Interaction category consists of 11 types of interactions.

Data manipulation involves operations performed on data to facilitate its subsequent use. Our Data Manipulation framework is structured along two axes and includes 17 distinct manipulations. The horizontal axis represents the **effect**, denoting the various expected outcomes when applying the manipulation. We have identified four effect types:
Augment, Reduce, Search, and Modify. Meanwhile, the vertical axis represents the **target**, denoting the entities on which the manipulation operates. We have categorized targets into two levels: Item and Dimension, differentiating between effects applied to data items and data dimensions.

- ***Augment Item*** 
  - **Real-Time Input** involves inputting data into the system in real-time and eliciting corresponding responses. For example, Li et al. 's system “*retrieves real-time data from the back-end through the web interface*
    *and forwards users’ interactions to the back-end to update the training*”.
  - **User Input** enables users to enhance existing data items. For example, in VATLD, users can derive actionable insights “*to generate more data that attempt to `lift distribution up' via data augmentation*”.
- ***Augment Dimension*** 
  - **Algorithmic Calculation** expands data dimensionality by introducing new variables or factors through specific algorithms or formulas applied to existing data. For example, Visinity “*uses permutation testing to determine the patterns’ staistical significance within a specimen and across a cohort*”.
  -  **Modeling** enhances data dimensionality by introducing a new set of parameters and potentially incorporating additional variables. For example, HetVis employs “*local data to train a stand-along training model in the same model architecture with the global HFL model*”.
  - **Clustering & Grouping** clusters similar data items and increases their dimensions by attaching group labels. For example, MoNetExplorer “*applies the HDBSCAN algorithm to cluster snapshots*”.
- ***Reduce Item*** 
  - **Excluding** reduces data items by retaining only the necessary data. For example, Zhang et al. “*only store historical events and related records that support spatio-temporal information reasoning*”.
  -  **Sampling** decreases the number of data items by selecting a smaller, representative subset. For example, MutualDetector employs “*a sampling method motivated by the outlier-biased sampling method*” to “*improve the readability of intermediate nodes in the image hierarchy*”.
- ***Reduce Dimension*** 
  - **Dimensionality Reduction** is a prevalent approach in VA aimed at reducing data dimensions to facilitate visualization . For example, DrugExplorer “*presents the learned embedding of all drugs in the knowledge graph using t-SNE and highlights the predicted drugs for the selected disease*”.
  - **Feature Selection** reduces data dimensions by selecting a subset of dimensions through specific algorithms or expert recommendations. For example, in DiagnosisAssistant, the authors “*extract 34 pertinent indicators*
    *based on the physicians’ suggestions*”.
- ***Search Item***
  - **Retrieval** searches for data items based on specific rules. For example, in EColVis, “*the forward queries help users obtain possible control strategies and their cascading impact by specifying partial strategies*”.
  -  **Similarity Calculation** employs pair-wise comparisons to search for desired data items, e.g., in Guo et al.’s work, “*the anomalous sequence is matched with normal sequence utilizing a matching metric based on the event probabilities derived from sequence reconstruction so as to detect event anomalies*”.
- ***Search Dimension*** 
  - **Explanability** entails searching for the most influential data dimensions to understand model behaviors, e.g., VEQA “*selects saliency and attribution approaches to explain the module in terms of evaluating the contribution of each input feature to the module output*”.
- ***Modify Item*** 
  - **Rectification** involves adjusting data items by rectifying values in specific dimension. For example, in SpectrumVA “*rectifies defects in the current inspection process by transforming the wavelength-flux relationship for each spectral line into a redshift-flux relationship*”.
  - **Parameter Tuning** modifies parameters rather than regular data items. For example, VASSL “*is designed to provide experts with interactive control of these techniques which rely heavily on parameters tuning*”.
- ***Modify Dimension***
  - **Wrangling** involves modifying data dimensions by transforming and structuring data from its raw form into a desired format to enhance data quality and usability. For example, In EmbeddingVis, the authors “*fit the graph space to the embedding space using regression analysis to understand what and how node metrics are potentially preserved by embedding vectors*”.

