## LIMITES ESTRICTOS POR MODULO (reglas de aislamiento)

 Modulo | Puede importar de | NO puede importar de |
--------|------------------|----------------------|
 `booking/domain` | nadie (POJO puro) | Spring, JPA, Wompi |
 `booking/application` | `booking/domain`, `billing/application` | Spring MVC, `catalog` directamente |
 `booking/infrastructure` | `booking/application`, Spring, JPA | `billing/domain` directamente |
 `billing/domain` | nadie (POJO puro) | Spring, JPA |
 `billing/application` | `billing/domain` | `catalog`, `iam` |
 `catalog/*` | Spring, JPA, `shared` | `booking`, `billing` |
 `iam/*` | Spring, JPA, `shared` | `booking`, `billing`, `catalog` |
 `notifications/*` | Spring, `shared` | `booking/domain`, `billing/domain` |
 `shared/*` | Spring, Java puro | ninguno de los modulos de negocio |

---
