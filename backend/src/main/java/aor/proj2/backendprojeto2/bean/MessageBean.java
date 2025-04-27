package aor.proj2.backendprojeto2.bean;

import aor.proj2.backendprojeto2.dao.MessageDao;
import aor.proj2.backendprojeto2.dao.UserDao;
import aor.proj2.backendprojeto2.dto.MessageDto;
import aor.proj2.backendprojeto2.entity.MessageEntity;
import aor.proj2.backendprojeto2.entity.UserEntity;
import jakarta.ejb.Stateless;
import jakarta.inject.Inject;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Stateless
public class MessageBean {

  @Inject
  private MessageDao messageDao;

  @Inject
  private UserDao userdao;

  public void createMessage(String sender, String receiver, String content) {
    UserEntity senderEntity = userdao.findUserByUsername(sender);
    UserEntity receiverEntity = userdao.findUserByUsername(receiver);

    if (senderEntity == null || receiverEntity == null) {
      throw new IllegalArgumentException("Sender or receiver not found");
    }

    MessageEntity message = new MessageEntity();
    message.setSender(senderEntity);
    message.setReceiver(receiverEntity);
    message.setContent(content);
    message.setTimestamp(LocalDateTime.now());
    message.setRead(false);

    messageDao.saveMessage(message);
  }

  public List<MessageDto> getMessagesBetweenUsers(String user1, String user2) {
    List<MessageEntity> messages = messageDao.getMessagesBetweenUsers(user1, user2);
    return messages.stream().map(this::convertToDto).collect(Collectors.toList());
  }

  public void markMessagesAsRead(String sender, String receiver) {
    messageDao.markMessagesAsRead(sender, receiver);
  }

  private MessageDto convertToDto(MessageEntity entity) {
    MessageDto dto = new MessageDto();
    dto.setId(entity.getId());
    dto.setSender(entity.getSender().getUsername());
    dto.setReceiver(entity.getReceiver().getUsername());
    dto.setContent(entity.getContent());
    dto.setTimestamp(entity.getTimestamp());
    dto.setRead(entity.isRead());
    return dto;
  }
}
