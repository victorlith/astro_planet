import sqlite3
import math


class ExoplanetModel:
    def __init__(self):
        self.__conn = sqlite3.connect('app/database/exoplanet_database.db')
        self.__conn.row_factory = self.__dict_factory

    def __dict_factory(self, cursor, row):
        d = {}
        for idx, col in enumerate(cursor.description):
            d[col[0]] = row[idx]
        return d

    def buscar_exoplaneta(self, nome: str) -> dict:
        try:
            cursor = self.__conn.cursor()
            cursor.execute(f'''
                            SELECT 
                                pl_name,
                                CASE WHEN pl_bmasse IS NULL THEN 0 ELSE ROUND(pl_bmasse, 2) END AS pl_bmasse,
                                pl_rade,
                                pl_dens,
                                CASE WHEN pl_orbper IS NULL THEN 0 ELSE ROUND(pl_orbper, 1) END AS pl_orbper,
                                disc_year,
                                discoverymethod,
                                hostname,
                                rastr,
                                decstr,
                                CASE WHEN sy_dist IS NULL THEN 0 ELSE ROUND(sy_dist, 2) END AS sy_dist,
                                CASE WHEN sy_dist IS NULL THEN 0 ELSE sy_dist * 3.26156 END AS sy_dist_ly,
                                CASE WHEN st_mass IS NULL THEN 0 ELSE st_mass END AS st_mass,
                                CASE WHEN st_rad IS NULL THEN 0 ELSE st_rad END AS st_rad,
                                st_teff,
                                st_spectype,
                                sy_pnum,
                                sy_snum,
                                CASE WHEN st_lum IS NULL THEN 0 ELSE st_lum END AS st_lum
                            FROM PSCompPars_2025 
                            WHERE pl_name = "{nome}" ''')

            response = cursor.fetchall()
            
            checar_valor = lambda x: None if x is None else x
            luminosidade: float = self.calcular_luminosidade(response[0]['st_lum'])
            zona_habitavel: float = self.calcular_zona_habitavel(luminosidade)
            response[0]['st_lum'] = luminosidade
            response[0]['pl_sy_zona_habitavel'] = zona_habitavel

            return response[0]
        except Exception as e:
            print(f'Erro ao buscar exoplaneta: {e}')
        finally:
            self.__conn.close()

    def buscar_todos_exoplanetas(self, offset=0):
        try:
            cursor = self.__conn.cursor()
            cursor.execute(f'SELECT pl_name, '
                           f'ROUND(pl_bmasse, 2) as pl_bmasse, '
                           f'ROUND(sy_dist * 3.26156, 2) as sy_dist_ly '
                           f'FROM PSCompPars_2025 WHERE pl_name IS NOT NULL ORDER BY pl_name ASC LIMIT 10 OFFSET {offset}')
            response = cursor.fetchall()
            return response
        except Exception as e:
            print(f'{e}')
        finally:
            self.__conn.close()

    def pesquisar_por_exoplaneta(self, nome):
        try:
            cursor = self.__conn.cursor()
            cursor.execute(f'SELECT pl_name, ROUND(pl_bmasse, 2) as pl_bmasse, ROUND(sy_dist * 3.26156, 2) as sy_dist_ly FROM PSCompPars_2025 WHERE pl_name LIKE "{nome}%" ORDER BY pl_name ASC LIMIT 10')
            response = cursor.fetchall()
            return response
        except Exception as e:
            print(f'Erro ao buscar exoplaneta: {e}')
        finally:
            self.__conn.close()
    
    def filtrar_exoplanetas(self, offset=0, filtro: str = None):
        try:
            cursor = self.__conn.cursor()
            cursor.execute(f'''
                                 SELECT pl_name, 
                                 CASE WHEN pl_bmasse IS NULL THEN 0 ELSE pl_bmasse END AS pl_bmasse, 
                                 CASE WHEN sy_dist IS NULL THEN 0 ELSE sy_dist * 3.26156 END AS sy_dist_ly 
                                 FROM PSCompPars_2025 WHERE pl_name LIKE "{filtro}%" LIMIT 10 OFFSET {offset} ''')
            response = cursor.fetchall()
            return response
        except Exception as e:
            print(f'{e}')
        finally:
            self.__conn.close()
    
    def calcular_luminosidade(self, lum):
        if lum:
            return 10 ** float(lum)
        else:
            return 0

    def calcular_zona_habitavel(self, luminosidade: float) -> float:
        if luminosidade:
            # Constantes para os limites interno e externo (relativo ao Sol)
            S_interno = 0.95
            S_externo = 1.37
            limite_interno = math.sqrt(luminosidade * S_interno)
            limite_externo = math.sqrt(luminosidade * S_externo)
            return limite_interno, limite_externo
        else:
            return 0
        

        