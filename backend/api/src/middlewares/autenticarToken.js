import jwt from "jsonwebtoken";

export default function autenticarToken(req, res, next) {
  try {
    const autorizacao = req.headers.authorization;

    if (!autorizacao) {
      return res.status(401).json({
        mensagem: "Token não fornecido."
      });
    }

    const partes = autorizacao.split(" ");

    if (
      partes.length !== 2 ||
      partes[0] !== "Bearer" ||
      !partes[1]
    ) {
      return res.status(401).json({
        mensagem: "Formato do token inválido."
      });
    }

    const token = partes[1];

    const usuarioDecodificado = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.usuario = usuarioDecodificado;

    return next();
  } catch (erro) {
    if (erro.name === "TokenExpiredError") {
      return res.status(403).json({
        mensagem: "Token expirado."
      });
    }

    return res.status(403).json({
      mensagem: "Token inválido."
    });
  }
}