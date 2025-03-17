package aor.proj2.backendprojeto2.utils;

public enum State {
    RASCUNHO(1),
    DISPONIVEL(2),
    RESERVADO(3),
    COMPRADO(4),
    PUBLICADO(5),
    INATIVO (6);

    private final int stateId;

    State(int stateId) {
        this.stateId = stateId;
    }

    public int getStateId() {
        return stateId;
    }

}