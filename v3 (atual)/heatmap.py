import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

# Carregar os dados dos CSVs
df_turnos = pd.read_csv('HorarioDeExemplo.csv', delimiter=';')
df_salas = pd.read_csv('CaracterizaçãoDasSalas.csv', delimiter=';', encoding='ISO-8859-1')

# Preparar os dados para criar o heatmap
# Vamos juntar as informações dos dois dataframes
df_turnos_salas = df_turnos.merge(df_salas, left_on='Sala atribuída à aula', right_on='Nome sala', how='left')

# Criar uma matriz de ocupação das salas
pivot_table = pd.pivot_table(df_turnos_salas, values='Inscritos no turno', index='Nome sala', columns='Dia da semana', aggfunc=np.sum)

# Preencher valores NaN com 0
pivot_table.fillna(0, inplace=True)

# Criar heatmap
plt.figure(figsize=(12, 8))
sns.heatmap(pivot_table, cmap='coolwarm', annot=True, fmt='g')
plt.title('Heatmap de Ocupação das Salas')
plt.xlabel('Dia da semana')
plt.ylabel('Sala')
plt.tight_layout()

# Salvar o heatmap em um arquivo de imagem (JPEG)
plt.savefig('heatmap_salas.jpg', format='jpg')

# Exibir o heatmap
plt.show()
